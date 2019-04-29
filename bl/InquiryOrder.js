'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('InquiryOrder.js');
const inquiryOrderDAO = require('../dao/InquiryOrderDAO.js');
const inquiryDAO = require('../dao/InquiryDAO.js');
const cityDAO = require('../dao/CityInfoDAO.js');
const routeDAO = require('../dao/RouteDAO.js');
const sysConsts = require("../util/SystemConst");
const moment = require('moment/moment.js');
const orderItemDAO = require("../dao/OrderItemDAO");
const commonUtil = require("../util/CommonUtil");

const addInquiryOrderByAdmin = (req,res,next) => {
    let params = req.params;
    const getInquiryId = ()=>{
        return new Promise((resolve,reject)=>{
            inquiryDAO.getInquiryByUserId(params,(error,rows)=> {
                if(error){
                    logger.error('addInquiryOrderByAdmin getInquiryId ' + error.message);
                    reject({err:error});
                }else{
                    if(rows && rows.length < 1){
                        logger.warn('addInquiryOrderByAdmin getInquiryId '+'No inquiry information!');
                        reject({msg:'查无此询价信息'});
                    }else{
                        logger.info('addInquiryOrderByAdmin getInquiryId '+'success');
                        let feePrice = 0;
                        let count = 0;
                        feePrice = feePrice + rows[0].fee_price;
                        count = count + rows[0].car_num;
                        params.userId = rows[0].user_id;
                        params.feePrice = feePrice;
                        params.carNum = count;
                        params.serviceType = rows[0].service_type;
                        params.createdType = sysConsts.ORDER.type.extrnal;
                        params.routeStartId = rows[0].start_id;
                        params.routeEndId = rows[0].end_id;
                        params.routeStart = rows[0].start_city;
                        params.routeEnd = rows[0].end_city;
                        params.routeId = rows[0].route_id;
                        params.oraTransPrice = rows[0].ora_trans_price;
                        params.oraInsurePrice = rows[0].ora_insure_price;
                        resolve(params);
                    }
                }
            })
        });
    }
    const getRoute = (inquiryInfo)=>{
        return new Promise((resolve,reject)=>{
            routeDAO.getRoute({routeId:inquiryInfo.routeId},(error,rows)=>{
                if(error){
                    logger.error('addInquiryOrderByAdmin getRoute ' + error.message);
                    reject({err:error});
                }else if(rows && rows.length < 1){
                    logger.warn('addInquiryOrderByAdmin getRoute '+'There is no such route！');
                    reject({msg:'没有这个路线'});
                }else{
                    logger.info('addInquiryOrderByAdmin getRoute '+'success');
                    inquiryInfo.distance = rows[0].distance;
                    resolve(inquiryInfo);
                }
            })
        });
    }
    const addInquiry = (inquiryInfo)=>{
        return new Promise((resolve,reject)=>{
            inquiryInfo.dateId = moment().format("YYYYMMDD");
            inquiryOrderDAO.addInquiryOrder(inquiryInfo,(error,result)=>{
                if(error){
                    logger.error('addInquiryOrderByAdmin addInquiryOrder ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('addInquiryOrderByAdmin addInquiryOrder '+'success');
                    resolve(inquiryInfo);
                }
            })
        });
    }
    const updateStatus = (inquiryInfo)=>{
        return new Promise((resolve,reject)=>{
            inquiryDAO.updateInquiryStatus({status:2,inquiryId:inquiryInfo.inquiryId},(error,result)=>{
                if(error){
                    logger.error('addInquiryOrderByAdmin updateStatus ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('addInquiryOrderByAdmin updateStatus '+'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        });
    }
    getInquiryId()
        .then(getRoute)
        .then(addInquiry)
        .then(updateStatus)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resInternalError(reject.err,res,next);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
}
const putInquiryOrder = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.putInquiryOrder(params,(error,result)=>{
        if(error){
            logger.error('putInquiryOrder ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('putInquiryOrder ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
    /*new Promise((resolve,reject)=>{
        inquiryDAO.getInquiryByUserId(params,(error,rows)=>{
            if(error){
                logger.error('getInquiryByUserId' + error.message);
                reject(error);
            }else if(rows && rows.length < 1){
                logger.warn('getInquiryByUserId'+'查无此询价信息');
                resUtil.resetFailedRes(res,'查无此询价信息',null);
            }else{
                logger.info('getInquiryByUserId'+'success');
                let feePrice = 0;
                let count = 0;
                for(let i = 0 ; i < rows.length ; i++){
                    feePrice = feePrice + rows[i].fee * rows[i].car_num;
                    count = count +rows[i].car_num
                }
                params.feePrice = feePrice;
                params.count = count;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            inquiryOrderDAO.putInquiryOrder(params,(error,result)=>{
                if(error){
                    logger.error('putInquiryOrder' + error.message);
                    reject(error);
                }else{
                    logger.info('putInquiryOrder' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })*/
}
const putReceiveInfo = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.updateById(params,(error,result)=>{
        if(error){
            logger.error('putReceiveInfo ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('putReceiveInfo ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const putFreightPrice = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.putFreightPrice(params,(error,result)=>{
        if(error){
            logger.error('putFreightPrice ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('putFreightPrice ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const putStatus = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.updateById(params,(error,rows)=>{
        if(error){
            logger.error('putStatus ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('putStatus ' + 'success');
            resUtil.resetUpdateRes(res,rows,null);
            return next;
        }
    })
}
const getOrder = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.getOrder(params,(error,result)=>{
        if(error){
            logger.error('getOrder ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getOrder ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getOrderByUser = (req,res,next) => {
    let params = req.params;
    if (params.statusList){
        params.statusList = params.statusList.split(",");
    }
    if (params.paymentStatusList){
        params.paymentStatusList = params.paymentStatusList.split(",");
    }
    inquiryOrderDAO.getOrderByUser(params,(error,result)=>{
        if(error){
            logger.error('getOrderByUser ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getOrderByUser ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const putAdminMark = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.putAdminMark(params,(error,result)=>{
        if(error){
            logger.error('putAdminMark ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('putAdminMark ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const cancelOrder = (req,res,next) => {
    let params = req.params;
    params.myDate = new Date();
    inquiryOrderDAO.cancelOrder(params,(error,result)=>{
        if(error){
            logger.error('cancelOrder ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('cancelOrder ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const putSendInfo = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.updateById(params,(error,result)=>{
        if(error){
            logger.error('putSendInfo ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('putSendInfo ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const addOrder = (req,res,next) => {
    let params = req.params;
    let routeStartId = "";
    let routeEndId = "";
    const getRouteId = () =>{
        return new Promise((resolve,reject)=>{
            params.createdType = sysConsts.ORDER.type.internal;
            routeStartId = routeStartId + params.routeStartId;
            routeEndId = routeEndId + params.routeEndId;
            if(params.routeStartId > params.routeEndId){
                params.routeId =routeEndId + routeStartId;
            }else{
                params.routeId = routeStartId + routeEndId;
            }
            resolve(params);
        });
    }
    const getRoute = (routeInfo)=>{
        return new Promise((resolve,reject)=>{
            routeDAO.getRoute({routeId:routeInfo.routeId},(error,rows)=>{
                if(error){
                    logger.error('addOrder getRoute ' + error.message);
                    reject({err:error});
                }else{
                    if(rows && rows.length < 1){
                        logger.warn('addOrder getRoute '+'There is no such route！');
                        reject({msg:'没有这个路线'});
                    }else{
                        logger.info('addOrder getRoute '+'success');
                        routeInfo.distance = rows[0].distance;
                        resolve(routeInfo);
                    }
                }
            })
        });
    }
    const getStartCity = (cityInfo)=>{
        return new Promise((resolve,reject)=>{
            cityDAO.queryCity({cityId:cityInfo.routeStartId},(error,rows)=>{
                if(error){
                    logger.error('addOrder getStartCity ' + error.message);
                    reject({err:error});
                }else{
                    if(rows && rows.length < 1){
                        logger.warn('addOrder getStartCity '+'There is no city！');
                        reject({msg:'没有这个城市'});
                    }else{
                        logger.info('addOrder getStartCity '+'success');
                        cityInfo.routeStart = rows[0].city_name;
                        resolve(cityInfo);
                    }
                }
            })
        });
    }
    const getEndCity = (cityInfo)=>{
        return new Promise((resolve,reject) =>{
            cityDAO.queryCity({cityId:cityInfo.routeEndId},(error,rows)=>{
                if(error){
                    logger.error('addOrder getEndCity ' + error.message);
                    reject({err:error});
                }else{
                    if(rows && rows.length < 1){
                        logger.warn('addOrder getEndCity '+'There is no city！');
                        reject({msg:'没有这个城市'});
                    }else{
                        logger.info('addOrder getEndCity '+'success');
                        cityInfo.routeEnd = rows[0].city_name;
                        resolve(cityInfo);
                    }
                }
            })
        });
    }
    const insterOrder = (orderInfo)=>{
        return new Promise((resolve,reject)=>{
            orderInfo.dateId = moment().format("YYYYMMDD");
            inquiryOrderDAO.addOrder(orderInfo,(error,rows)=>{
                if(error){
                    logger.error('addOrder insterOrder' + error.message);
                    reject({err:error});
                }else{
                    logger.info('addOrder insterOrder' + 'success');
                    resUtil.resetCreateRes(res,rows,null);
                    return next();
                }
            })
        });
    }
    getRouteId()
        .then(getRoute)
        .then(getStartCity)
        .then(getEndCity)
        .then(insterOrder)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resInternalError(reject.err,res,next);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
}
const getOrderNew = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.getOrderNew(params,(error,result)=>{
        if(error){
            logger.error('getOrderNew ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getOrderNew ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const updatePaymentRemark = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.updatePaymentRemark(params,(error,result)=>{
        if(error){
            logger.error('updatePaymentRemark ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updatePaymentRemark ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const updateById = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.updateById(params,(error,result)=>{
        if(error){
            logger.error('updateById ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateById ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const selfMentionAddress = (req,res,next) => {
    let params = req.params;
    let orderServiceType = null ;
    new Promise((resolve,reject)=>{
        inquiryOrderDAO.getById({orderId:params.orderId},(error,rows)=>{
            if(error){
                logger.error('selfMentionAddress getById ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('selfMentionAddress getById ' + 'success');
                if (rows.length > 0){
                    orderServiceType = rows[0].service_type;
                    resolve();
                } else {
                    resUtil.resetFailedRes(res,sysMsg.ORDER_NO_EXISTE);
                }
            }
        })
    }).then(()=>{
        if (orderServiceType == sysConsts.ORDER.serviceType.selfMention) {
            inquiryOrderDAO.updateById(params,(error,result)=>{
                if(error){
                    logger.error('selfMentionAddress updateById ' + error.message);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info('selfMentionAddress updateById ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        }else {
            resUtil.resetFailedRes(res,sysMsg.ORDER_SERVICETYPE_SELFMENTION_UPDATE_ADDRESS)
        }
    })
}
const getOrderProfit = (req,res,next) => {
    let params = req.params;
    inquiryOrderDAO.getOrderProfit(params,(error,result)=>{
        if(error){
            logger.error('getOrderProfit ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getOrderProfit ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getOrderCostOfCar = (req,res,next) => {
    let params = req.params;
    orderItemDAO.getOrderCostOfCar(params,(error,result)=>{
        if(error){
            logger.error('getOrderCostOfCar ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getOrderCostOfCar ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const orderWithoutInquiry =(req,res,next)=>{
    let params = req.params;
    let oraTransPrice = 0;
    let oraInsurePrice = 0;
    let resultCallback;
    new Promise((resolve,reject)=>{
        routeDAO.getRoute({routeStartId:params.routeStartId,routeEndId:params.routeEndId},(error,result)=>{
            if(error){
                logger.error('orderWithoutInquiry getRoute ' + error.message);
                resUtil.resInternalError(error,res,next);
                reject(error);
            }else{
                logger.info('orderWithoutInquiry getRoute ' + 'success');
                params.distance = result[0].distance;
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            params.dateId = moment().format("YYYYMMDD");
            if (params.routeStartId > params.routeEndId){
                params.routeId = parseInt(params.routeEndId.toString()+params.routeStartId.toString());
            } else {
                params.routeId = parseInt(params.routeStartId.toString()+params.routeEndId.toString());
            }
            params.adminId =0;
            inquiryOrderDAO.addOrder(params,(error,result)=>{
                if(error){
                    logger.error('orderWithoutInquiry addOrder ' + error.message);
                    resUtil.resInternalError(error,res,next);
                    reject(error);
                }else{
                    logger.info('orderWithoutInquiry addOrder ' + 'success');
                    params.orderId = result.insertId;
                    resultCallback = result;
                    resolve();
                }
            })
        }).then(()=>{
            new Promise((resolve,reject)=>{
                let orderItemList = params.orderItemArray;
                for (let i in orderItemList) {
                    let price = commonUtil.calculatedAmount(params.serviceType,orderItemList[i].oldCar,orderItemList[i].modelType,params.distance,orderItemList[i].safeStatus, orderItemList[i].valuation);
                    orderItemList[i].oraTransPrice = price.trans;
                    orderItemList[i].oraInsurePrice = price.insure;
                    orderItemList[i].distance = params.distance;
                    orderItemList[i].orderId = params.orderId;
                    orderItemList[i].userId = params.userId;
                    oraTransPrice += price.trans;
                    oraInsurePrice += price.insure;
                    orderItemDAO.addOrderCar(orderItemList[i],(error,result)=>{
                        if(error){
                            logger.error('orderWithoutInquiry addOrderCar ' + error.message);
                            resUtil.resInternalError(error,res,next);
                        }else{
                            logger.info('orderWithoutInquiry addOrderCar ' + 'success');
                        }
                    });
                    if (i == orderItemList.length-1){
                        resolve();
                    }
                }
            }).then(()=>{
                let options ={
                    oraTransPrice:oraTransPrice,
                    oraInsurePrice:oraInsurePrice,
                    orderId:params.orderId,
                    status:sysConsts.ORDER.status.priceToBeImproved
                }
                inquiryOrderDAO.updateById(options,(error,result)=>{
                    if(error){
                        logger.error('orderWithoutInquiry updateById ' + error.message);
                        resUtil.resInternalError(error,res,next);
                    }else{
                        logger.info('orderWithoutInquiry updateById ' + 'success');
                        resUtil.resetCreateRes(res,resultCallback,null);
                        return next();
                    }
                })
            })
        })
    })
}
module.exports = {
    addInquiryOrderByAdmin,
    putInquiryOrder,
    putReceiveInfo,
    putFreightPrice,
    putStatus,
    getOrder,
    putAdminMark,
    cancelOrder,
    putSendInfo,
    getOrderByUser,
    addOrder,
    getOrderNew,
    updatePaymentRemark,
    updateById,
    selfMentionAddress,
    getOrderProfit,
    getOrderCostOfCar,
    orderWithoutInquiry//微信直接生成订单
}

