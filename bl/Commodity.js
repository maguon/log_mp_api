'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require("../util/SystemMsg");
const sysConst = require("../util/SystemConst");
const logger = serverLogger.createLogger('Commodity.js');
const commodityDAO = require('../dao/CommodityDAO.js');
const cityInfoDAO = require('../dao/CityInfoDAO.js');
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

const getCommodityPage = (req,res,next) =>{
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

    const getView =(record)=>{
        return new Promise(()=>{
            res.writeHead(200,{'Content-Type':'text/html'})
            fs.readFile('./bl/view/car.tpl','utf-8',function(err,data){
                if(err){
                    logger.error('getCommodityPage getView ' + err);
                    throw err ;
                }else{
                    var prod = {
                        name: record.commodity_name,
                        original_price: record.original_price,
                        actual_price: record.actual_price,
                       // img_url: require('./bl/assets/slopa-pic-01.jpg'),
                        type: record.type,
                        info: record.info,
                        code_url:record.image
                    };
                    var pattern = /{{([\s\S]+?)}}/gi;
                    var result = data.replace(pattern, (match, datas)=>{
                        return prod[datas];
                    });
                    res.end(result);
                    logger.info(' getCommodityPage getView ' + 'success');
                    return next();
                }

            });
        });
    }

    getCommodity()
        .then(getView)
        .catch((reject)=>{
            if(reject.err){
                // resUtil.resetFailedRes(res,reject.err);
                res.end(reject.err);
                return next();
            }else{
                // resUtil.resetFailedRes(res,reject.msg);
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
    getCommodityPage,
    addCommodity,
    updateImage,
    updateInfo,
    updateCommodity,
    updateStatus,
    updateShowStatus
}