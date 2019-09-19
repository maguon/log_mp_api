'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require("../util/SystemMsg");
const sysConst = require("../util/SystemConst");
const sysConfig = require("../config/SystemConfig");
const logger = serverLogger.createLogger('Commodity.js');
const commodityDAO = require('../dao/CommodityDAO.js');
const cityInfoDAO = require('../dao/CityInfoDAO.js');
const recommendInfoDAO = require("../dao/RecommendInfoDAO");
const posterDAO = require("../dao/PosterDAO");
const moment = require('moment/moment.js');
const fs = require('fs');

const getCommodity = (req,res,next) => {
    let params = req.params;
    commodityDAO.getCommodity(params,(error,rows)=>{
        if(error){
            logger.error(' getCommodity ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' getCommodity ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
const getAdminCommodity = (req,res,next) => {
    let params = req.params;
    commodityDAO.getAdminCommodity(params,(error,rows)=>{
        if(error){
            logger.error(' getAdminCommodity ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' getAdminCommodity ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
const getCommodityPage = (req,res,next) =>{
    logger.info("req:"+req);
    var arrGourp = req.toString().split("view?from=groupmessage");//微信群
    var arrTimeline = req.toString().split("view?from=timeline");//朋友圈
    var arrSinglemessage = req.toString().split("view?from=singlemessage");//好友分享
    if((arrGourp[1] == null) && (arrTimeline[1] == null) && (arrSinglemessage[1] == null)) {
        logger.info('getCommodityPage Not Wechat Access!');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('404');
        res.end();
        return next();
    }

    let params = req.params;
    const getCommodity = ()=>{
        return new Promise((resolve, reject)=>{
            commodityDAO.getCommodity(params,(error,rows)=>{
                if(error){
                    logger.error(' getCommodityPage getCommodity ' + error.message);
                    reject({err:error});
                }else{
                    logger.info(' getCommodityPage getCommodity ' + 'success');
                    if(rows.length){
                        resolve(rows[0]);
                    }else{
                        reject({msg:sysMsg.COMMODITY_ID_ERROR});
                    }
                }
            })
        });
    }
    const getPoster = (commodityInfo)=>{
        return new Promise((resolve, reject)=>{
            posterDAO.selectPosterInfo(params,(error,result)=>{
                if(error){
                    logger.error('getPoster ' + error.message);
                    reject({err:error});
                }else{
                    if(result.length > 0) {
                        logger.info('getCommodityPage getPoster ' + 'success');
                        commodityInfo.title = result[0].title;
                        commodityInfo.recommendId = result[0].recommend_id;
                        commodityInfo.viewCount = result[0].view_count;
                        resolve(commodityInfo);
                    }else{
                        logger.info('getCommodityPage getPoster ' + sysMsg.POSTER_ID_ERROR);
                        reject({msg:sysMsg.POSTER_ID_ERROR});
                    }

                }
            });
        });
    }
    const getRecommend = (commodityInfo)=>{
        return new Promise((resolve, reject)=>{
            recommendInfoDAO.select({recommendId:commodityInfo.recommendId},(error,result)=>{
                if (error){
                    logger.error('getCommodityPage getRecommend ' + error.message);
                    resUtil.resInternalError(error, res, next);
                } else {
                    if(result.length > 0){
                        logger.info('getCommodityPage getRecommend ' + 'success');
                        commodityInfo.pageUrl = result[0].page_url;
                        commodityInfo.favorable_Price = Number((commodityInfo.original_price - commodityInfo.actual_price)/10000).toFixed(2);
                        commodityInfo.original_price = Number(Number(commodityInfo.original_price)/10000).toFixed(2);
                        commodityInfo.actual_price = Number(Number(commodityInfo.actual_price)/10000).toFixed(2);
                        commodityInfo.image = 'http://' + sysConfig.hosts.image.host + ':'+ sysConfig.hosts.image.port + '/api/image/' + commodityInfo.image;
                        commodityInfo.mp_url = result[0].mp_url;
                        console.log('commodityInfo.sale_time:' + commodityInfo.sale_time);
                        if(commodityInfo.sale_time == null){
                            commodityInfo.saleTime = '敬请期待开售时间！';
                            commodityInfo.onSale = ' ';
                        }else{
                            commodityInfo.saleTime = moment(commodityInfo.sale_time).format('MM月DD日 HH:mm:ss');
                            commodityInfo.onSale = '开售';
                        }
                        let arr = commodityInfo.pord_images.split(",") ;
                        let arrHtml;
                        for(let i of arr){
                            let imageAddress = 'http://' + sysConfig.hosts.image.host + ':'+ sysConfig.hosts.image.port + '/api/image/' + i;
                            if(arrHtml == null){
                                arrHtml ='<img style="width: 100%;" src=' + imageAddress +'  class="mb2" />';
                            }else{
                                arrHtml = arrHtml + '<img style="width: 100%;" src=' + imageAddress +'  class="mb2" />';
                            }
                        }
                        commodityInfo.arrHtml = arrHtml;
                        console.log(arrHtml);
                        resolve(commodityInfo);
                    }else{
                        logger.info('getCommodityPage getRecommend ' + sysMsg.RECOMMEND_TASK_NO_EXISTS);
                        resUtil.resetFailedRes(res,sysMsg.RECOMMEND_TASK_NO_EXISTS);
                    }
                }
            })
        });
    }
    const updateViewCount =(commodityInfo)=>{
        return new Promise((resolve, reject) => {
            commodityInfo.viewCount = commodityInfo.viewCount + 1;
            posterDAO.updateCount({viewCount:commodityInfo.viewCount,posterId:params.posterId},(error,result)=>{
                if(error){
                    logger.error('updateCoupon ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('updateCoupon  ' + 'success');
                    resolve(commodityInfo);
                }
            })

        });
    }
    const getView =(record)=>{
        return new Promise(()=>{
            res.writeHead(200,{'Content-Type':'text/html'})
           //res.writeHead(200, { 'Content-Type': 'text/css' });
            fs.readFile('./bl/view/car.tpl','utf-8',function(err,data){
                if(err){
                    logger.error('getCommodityPage getView ' + err);
                    throw err ;
                }else{
                    logger.info(' getCommodityPage getView ' + 'success');
                    //console.log("读取的数据：",data);
                    var prod = {
                        title: record.title,
                        commodity_name: record.commodity_name,
                        original_price: record.original_price,
                        actual_price: record.actual_price,
                        favorable_Price: record.favorable_Price,
                        city_name:record.city_name,
                        image: record.image,
                        info: record.info,
                        saleTime:record.saleTime,
                        onSale:record.onSale,
                        mp_url:record.mp_url,
                        pord_images:record.arrHtml
                    };
                    var pattern = /{{([\s\S]+?)}}/gi;
                    var result = data.replace(pattern, (match, datas)=>{
                        return prod[datas];
                    });
                    console.log("读取的数据：",result);
                    res.write(result);
                    res.end();
                    return next();
                }
            });
        });
    }
    getCommodity()
        .then(getPoster)
        .then(getRecommend)
        .then(updateViewCount)
        .then(getView)
        .catch((reject)=>{
            if(reject.err){
                console.log("error!");
                res.end(reject.err);
                return next();
            }else{
                console.log("msg!");
                res.end(reject.msg);
                return next();
            }
        })
}
const addCommodity = (req,res,next)=>{
    let params = req.params;
    if(params.type == sysConst.PRODUCT_ORDER.type.whole ){
        //全款购车
        params.earnestMoney = 0;
    }
    if(params.type == sysConst.PRODUCT_ORDER.type.earnestMoney ){
        //定金购车
    }
    if(params.type == sysConst.PRODUCT_ORDER.type.arrivalOfGoods ){
        //到货付款
        params.earnestMoney = 0;
    }
    params.status = 1;
    params.showStatus = 0;
    params.image = '';
    params.info = '';
    params.saledQuantity = 0;

    const getCity = ()=>{
        return new Promise((resolve, reject) => {
            cityInfoDAO.queryCity({cityId:params.cityId},(error,result)=>{
                if(error){
                    logger.error('addCommodity getCity ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('addCommodity getCity ' + 'success');
                    if(result.length){
                        params.cityName = result[0].city_name;
                        resolve();
                    }else{
                        reject({msg:sysMsg.CITY_ID_ERROR});
                    }
                }
            })
        });
    }

    const add =()=>{
        return new Promise(()=>{
            commodityDAO.addCommodity(params,(error,result)=>{
                if(error){
                    logger.error('addCommodity add ' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                }else{
                    logger.info('addCommodity add ' + 'success');
                    resUtil.resetCreateRes(res,result,null);
                    return next();
                }
            });
        });
    }
    getCity()
        .then(add)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resetFailedRes(res,reject.err);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
};
const getAndUpdateSaledQuantityNum = (params,callback) => {
    commodityDAO.updateSaledQuantityOrStatus(params,(error,result)=>{
        if(error){
            logger.error(' getAndUpdateSaledQuantityNum updateSaledQuantityNum ' + error.message);
            reject({err:error});
        }else{
            logger.info(' getAndUpdateSaledQuantityNum updateSaledQuantityNum ' + 'success')
            return callback(null,result);
        }
    })
}
const updateImage = (req,res,next) => {
    let params = req.params;
    commodityDAO.updateImage(params,(error,result)=>{
        if(error){
            logger.error('updateImage ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('updateImage  ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const updateProdImages = (req,res,next) => {
    let params = req.params;
    commodityDAO.updateProdImages(params,(error,result)=>{
        if(error){
            logger.error('updateProdImages ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('updateProdImages  ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const updateInfo = (req,res,next) => {
    let params = req.params;
    commodityDAO.updateInfo(params,(error,result)=>{
        if(error){
            logger.error('updateInfo ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('updateInfo  ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const updateCommodity = (req,res,next) => {
    let params = req.params;
    if(params.type == 1 ){
        //全款购车
        params.earnestMoney = 0;
    }
    if(params.type == 2 ){
        //定金购车
    }
    if(params.type == 3 ){
        //到货付款
        params.earnestMoney = 0;
    }
    params.status = 1;
    params.showStatus = 0;

    const getCity = ()=>{
        return new Promise((resolve, reject) => {
            cityInfoDAO.queryCity({cityId:params.cityId},(error,result)=>{
                if(error){
                    logger.error('updateCommodity getCity ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('updateCommodity getCity ' + 'success');
                    if(result.length){
                        params.cityName = result[0].city_name;
                        resolve();
                    }else{
                        reject({msg:sysMsg.CITY_ID_ERROR});
                    }
                }
            })
        });
    }
    const updateInfo =()=>{
        return new Promise(()=>{
            commodityDAO.updateCommodity(params,(error,result)=>{
                if(error){
                    logger.error('updateCommodity updateInfo ' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                }else{
                    logger.info('updateCommodity updateInfo  ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        });
    }
    getCity()
        .then(updateInfo)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resetFailedRes(res,reject.err);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })

}
const updateStatus = (req,res,next) => {
    let params = req.params;
    if(params.status == sysConst.COMMODITY.status.sold){
        params.sellOutTime = new Date();
    }else{
        params.sellOutTime = null;
    }
    commodityDAO.updateStatus(params,(error,result)=>{
        if(error){
            logger.error(' updateStatus ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' updateStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const updateShowStatus = (req,res,next) => {
    let params = req.params;
    commodityDAO.updateShowStatus(params,(error,result)=>{
        if(error){
            logger.error(' updateShowStatus ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' updateShowStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports={
    getCommodity,
    getAdminCommodity,
    getCommodityPage,
    addCommodity,
    getAndUpdateSaledQuantityNum,
    updateImage,
    updateProdImages,
    updateInfo,
    updateCommodity,
    updateStatus,
    updateShowStatus
}