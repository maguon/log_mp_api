'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Recommend.js');
const sysConsts = require("../util/SystemConst");
const https = require('https');
const fs = require('fs');
const sysConfig = require("../config/SystemConfig");
const recommendInfoDAO = require("../dao/RecommendInfoDAO");
const adminUser = require('../dao/AdminUserDAO');
const encrypt = require("../util/Encrypt");

const addRecommend = (req,res,next)=>{
    let params = req.params;
    recommendInfoDAO.add(params,(error,rows)=>{
        if(error){
            logger.error('addRecommend ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('addRecommend ' + 'success');
            resUtil.resetCreateRes(res,rows,null);
            return next;
        }
    });
}
const getRecommend = (req,res,next)=>{
    let params = req.params;
    new Promise((resolve,reject)=>{
        adminUser.queryAdminUser(params,(error,result)=>{
            if(error){
                logger.error('getRecommend queryAdminUser ' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            }else{
                logger.info('getRecommend queryAdminUser ' + 'success');
                if (result.length > 0){
                    resolve();
                } else {
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                }
            }
        });
    }).then(()=>{
        recommendInfoDAO.select(params,(error,result)=>{
            if(error){
                logger.error('getRecommend select ' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('getRecommend select ' + 'success');
                resUtil.resetQueryRes(res,result,null);
                return next();
            }
        });
    })
}
const updateRecommend = (req,res,next)=>{
    let params = req.params;
    new Promise((resolve,reject)=>{
        adminUser.queryAdminUser(params,(error,result)=>{
            if(error){
                logger.error('updateRecommend queryAdminUser ' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            }else{
                logger.info('updateRecommend queryAdminUser ' + 'success');
                if (result.length > 0){
                    resolve();
                } else {
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                }
            }
        });
    }).then(()=>{
        recommendInfoDAO.update(params,(error,result)=>{
            if(error){
                logger.error('updateRecommend update ' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('updateRecommend update ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        });
    })
}
const addAdvertisement = (req,res,next)=>{
    let params = req.params;
    new Promise((resolve,reject)=>{
        adminUser.queryAdminUser(params,(error,result)=>{
            if(error){
                logger.error('addAdvertisement queryAdminUser ' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            }else{
                logger.info('addAdvertisement queryAdminUser ' + 'success');
                if (result.length > 0){
                    resolve();
                } else {
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                }
            }
        });
    }).then(()=>{
        recommendInfoDAO.update(params,(error,result)=>{
            if(error){
                logger.error('addAdvertisement update ' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('addAdvertisement update ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        });
    })
}
const postWxCodeImage= (req,res,next)=>{
    let params = req.params;
    new Promise((resolve,reject)=>{
        getAccessToken(sysConfig.wechatConfig,(error,data)=>{
            if (error){
                logger.error('postWxCodeImage getAccessToken ' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            } else {
                logger.info('postWxCodeImage getAccessToken ' + 'success');
                if (data.errcode){
                    resUtil.resetFailedRes(res,data.errmsg);
                }else {
                    params.accessToken = data.access_token;
                    resolve();
                }
            }
        });
    }).then(()=>{
        new Promise((resolve,reject)=>{
            let randomString = encrypt.randomString(6);
            params.fileName = "wx_code_"+params.recommendId+"_"+randomString;
            params.photoSrc = './public/docs/wx_img/'+params.fileName+'.png';
            let wxParams ={
                recommendId:params.recommendId,
                accessToken:params.accessToken,
                photoSrc : params.photoSrc
            }
            getWXACodeUnlimit(wxParams,(error,result)=>{
                if (error){
                    logger.error('postWxCodeImage getWXACodeUnlimit ' + error.message);
                    resUtil.resInternalError(error, res, next);
                    reject(error);
                } else {
                    logger.info('postWxCodeImage getWXACodeUnlimit ' + 'success');
                    logger.info(result);
                    if (result.success){
                        resolve();
                    } else {
                        resUtil.resetFailedRes(res, result.body);
                    }
                }
            });
        }).then(()=>{
            let mpUrl = "http://"+sysConfig.hosts.wx.host+":"+sysConfig.hosts.wx.port+"/wx_img/"+params.fileName+".png";
            logger.info('create wxImage Url '+mpUrl);
            recommendInfoDAO.update({recommendId: params.recommendId,mpUrl:mpUrl},(error,result)=>{
                if(error){
                    logger.error('postWxCodeImage update ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    logger.info('postWxCodeImage update ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            });
        })
    })
}
const getAchievement= (req,res,next)=>{
    let params = req.params;
    recommendInfoDAO.selectAchievement(params,(error,rows)=>{
        if (error){
            logger.error('getAchievement selectAchievement ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info('getAchievement selectAchievement ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next;
        }
    });
}
const getAccessToken=(params,callback)=>{
    let url = '/cgi-bin/token?grant_type=client_credential&appid='+params.mpAppId+"&secret="+params.mpSecret;
    let options ={
        hostname: 'api.weixin.qq.com',
        port: 443,
        path: url ,
        method: 'GET'
    }
    const httpsReq = https.request(options, (res) => {
        let data = "";
        res.on('data', (d) => {
            data += d;
        }).on('end',()=>{
            callback(null,JSON.parse(data));
        });
    });

    httpsReq.on('error', (e) => {
        logger.info('getAccessToken '+ e.message);
        callback(e,null);
    });
    httpsReq.end();
}
const getWXACodeUnlimit=(params,callback)=>{
    let wxCodeResult={};
    let url = "/wxa/getwxacodeunlimit?access_token="+params.accessToken;
    let post_data = JSON.stringify({
        "scene":params.recommendId,
        "page":"pages/about/about",
        "is_hyaline":true
    });
    let options ={
        hostname: 'api.weixin.qq.com',
        port: 443,
        path: url ,
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Content-Length': post_data.length
        }
    }
    const httpsReq = https.request(options, (wxRes) => {
        logger.info("wxRes:"+wxRes);
        if (wxRes.headers['content-type'] == "application/json") {
            wxCodeResult.success = false;
            wxCodeResult.body = JSON.parse(wxRes);
        }else {
            wxCodeResult.success = true;
            let ws = fs.createWriteStream(params.photoSrc);
            wxRes.pipe(ws);
            //callback(null,wxCodeResult);
        }
        wxRes.on('end',()=>{
            callback(null,wxCodeResult);
        });
    });
    httpsReq.write(post_data,'utf-8');
    httpsReq.end();
    httpsReq.on('error', (e) => {
        // logger.info('getWXACodeUnlimit '+ e.message);
        callback(e,null);
    });
    httpsReq.end();
}

module.exports={
    addRecommend,
    getRecommend,
    updateRecommend,
    addAdvertisement,
    postWxCodeImage,
    getAchievement
}