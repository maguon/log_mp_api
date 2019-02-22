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
            logger.error('addRecommend' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('addRecommend' + 'success');
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
                logger.error('queryAdminUser' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            }else{
                logger.info('queryAdminUser' + 'success');
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
                logger.error('selectRecommend' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('selectRecommend' + 'success');
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
                logger.error('queryAdminUser' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            }else{
                logger.info('queryAdminUser' + 'success');
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
                logger.error('updateRecommend' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('updateRecommend' + 'success');
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
                logger.error('queryAdminUser' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            }else{
                logger.info('queryAdminUser' + 'success');
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
                logger.error('updateRecommend' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('updateRecommend' + 'success');
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
                logger.error('getAccessToken' + error.message);
                resUtil.resInternalError(error, res, next);
                reject(error);
            } else {
                logger.info('getAccessToken' + 'success');
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
                    logger.error('getWXACodeUnlimit' + error.message);
                    resUtil.resInternalError(error, res, next);
                    reject(error);
                } else {
                    logger.info('getWXACodeUnlimit' + 'success');
                    if (result.success){
                        resolve();
                    } else {
                        resUtil.resetFailedRes(res, result.body);
                    }
                }
            });
        }).then(()=>{
            // let mpUrl = "http://localhost:9101/wx_img/"+params.fileName+".png";
            let mpUrl = "http://stg.myxxjs.com:9101/wx_img/"+params.fileName+".png";
            recommendInfoDAO.update({recommendId: params.recommendId,mpUrl:mpUrl},(error,result)=>{
                if(error){
                    logger.error('updateRecommend' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    logger.info('updateRecommend' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            });
        })
    })
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
        logger.info('getAccessToken :'+ e.message);
        callback(e,null);
    });
    httpsReq.end();
}
const getWXACodeUnlimit=(params,callback)=>{
    let wxCodeResult={};
    let url = "/wxa/getwxacodeunlimit?access_token="+params.accessToken;
    let post_data = JSON.stringify({
        "scene":params.recommendId,
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
        if (wxRes.headers['content-type'] == "application/json") {
            wxCodeResult.success = false;
            wxCodeResult.body = JSON.parse(wxRes);
        }else {
            wxCodeResult.success = true;
            let ws = fs.createWriteStream(params.photoSrc);
            wxRes.pipe(ws);
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
    postWxCodeImage
}