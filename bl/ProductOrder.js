'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require("../util/SystemMsg");
const sysConst = require("../util/SystemConst");
const moment = require('moment/moment.js');
const logger = serverLogger.createLogger('ProductOrder.js');
const commodity = require('../bl/Commodity');
const productOrderDAO = require('../dao/ProductOrderDAO.js');
const productOrderItemDAO = require('../dao/ProductOrderItemDAO');
const commodityDAO = require('../dao/CommodityDAO');

const getPaymentStatus =(req,res,next)=>{
    let params = req.params;
    let resMsg ={
        paymentFlag:true
    }
    productOrderDAO.getOrderPaymentStatus(params,(error,rows)=>{
        if(error){
            logger.error('getPaymentStatus ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getPaymentStatus ' + 'success');
            if(rows.length <= 0){
                resMsg.paymentFlag = false;
                resUtil.resetQueryRes(res,resMsg,null);
                return next();
            }else{
                for(let i in rows){
                    if(rows[i].status == sysConst.COMMODITY.status.reserved ){
                        resMsg.paymentFlag = false;
                        resUtil.resetQueryRes(res,resMsg,null);
                        return next();
                    }
                    if (i == rows.length - 1) {
                        resMsg.paymentFlag = true;
                        resUtil.resetQueryRes(res,resMsg,null);
                        return next();
                    }
                }
            }
        }
    });
}
const getUserProductOrder = (req,res,next) => {
    let params = req.params;
    productOrderDAO.getUserProductOrder(params,(error,rows)=>{
        if(error){
            logger.error(' getUserProductOrder ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' getUserProductOrder ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
const getUserProductOrderAndItem = (req,res,next) => {
    let params = req.params;
    productOrderDAO.getUserProductOrderAndItem(params,(error,rows)=>{
        if(error){
            logger.error(' getUserProductOrderAndItem ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' getUserProductOrderAndItem ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
const getProductOrder = (req,res,next) => {
    let params = req.params;
    productOrderDAO.getProductOrder(params,(error,rows)=>{
        if(error){
            logger.error(' getProductOrder ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' getProductOrder ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
const addUserProductOrder = (req,res,next) =>{
    let params = req.params;
    let oraTransPrice = 0.00;//原总价
    let actTransPrice = 0.00;//售总价
    let earnestMoney = 0.00;//应支付总定金
    params.realPaymentPrice = 0.00;//支付总金额
    params.paymentStatus = sysConst.PRODUCT_ORDER.payment_status.unPaid;//支付状态（1:未支付 3.支付完成 4.已退款）
    params.status = sysConst.PRODUCT_ORDER.status.tpShipped;//订单状态（1:待发货 4:已发货 6:已取消  8:已送达 ）
    params.dateId = moment().format("YYYYMMDD");
    let commodityList = {};
    let resultCallback;
    let ProductOrderId;
    let type;
    let orderItemList = params.productOrderItemArray;
    for (let i in orderItemList) {
        if(orderItemList[0].type){
            type = orderItemList[0].type;
        }
        if(orderItemList[i].type != type){
            logger.error('addUserProductOrder addProductOrder ' + sysMsg.PRODUCT_ORDER_TYPE_ERROR);
            resUtil.resetFailedRes(res,sysMsg.PRODUCT_ORDER_TYPE_ERROR);
            return next();
        }
    }
    if(type == sysConst.PRODUCT_ORDER.type.arrivalOfGoods){
        params.paymentStatus = sysConst.PRODUCT_ORDER.payment_status.complete;//支付完成
    }
    new Promise((resolve, reject) => {
        productOrderDAO.addProductOrder(params, (error, result) => {
            if (error) {
                logger.error('addUserProductOrder addProductOrder ' + error.message);
                reject(error);
            } else {
                logger.info('addUserProductOrder addProductOrder ' + 'success');
                resultCallback = result;
                ProductOrderId = result.insertId;
                resolve();
            }
        });
    }).then(() => {
        for (let i in orderItemList) {
            new Promise((resolve, reject) => {
                commodityDAO.getCommodity({commodityId: orderItemList[i].commodityId}, (error, rows) => {
                    if (error) {
                        logger.error(' addUserProductOrder getCommodity ' + error.message);
                        reject(error);
                    } else {
                        logger.info(' addUserProductOrder getCommodity ' + 'success');
                        if (rows.length) {
                            commodityList = rows[0];
                            resolve();
                        } else {
                            reject({msg: sysMsg.COMMODITY_ID_ERROR});
                        }
                    }
                });
            }).then(() => {
                 new Promise((resolve) => {
                    orderItemList[i].commodityName = commodityList.commodity_name;//商品名称
                    orderItemList[i].cityId = commodityList.city_id;//城市编号
                    orderItemList[i].cityName = commodityList.city_name;//城市名称
                    orderItemList[i].type = commodityList.type;//购付类型
                    orderItemList[i].originalPrice = commodityList.original_price;
                    orderItemList[i].actualPrice = commodityList.actual_price;
                    orderItemList[i].earnestMoney = commodityList.earnest_money;
                    orderItemList[i].quantity = commodityList.quantity;
                    orderItemList[i].saledQuantity = commodityList.saled_quantity;

                    oraTransPrice += commodityList.original_price;//原价
                    actTransPrice += commodityList.actual_price;//售价
                    earnestMoney += commodityList.earnest_money;//应付定金
                    resolve();
                }).then(() => {
                    new Promise((resolve,reject)=>{
                        orderItemList[i].productOrderId = ProductOrderId;//订单编号
                        productOrderItemDAO.addProductOrderItem(orderItemList[i], (error, result) => {
                            if (error) {
                                logger.error('addUserProductOrder addProductOrderItem commodityId:' + orderItemList[i].commodityId + error.message);
                                reject(error);
                            } else {
                                logger.info('addUserProductOrder addProductOrderItem commodityId:' + orderItemList[i].commodityId + ' success');
                                resolve();
                            }
                        });
                    }).then(()=>{
                        new Promise((resolve, reject) => {
                            params.oraTransPrice = oraTransPrice;
                            params.actTransPrice = actTransPrice;
                            params.earnestMoney = earnestMoney;
                            params.productOrderId =  ProductOrderId;

                            productOrderDAO.updateProductOrder(params,(error,result)=>{
                                if(error){
                                    logger.error('addUserProductOrder updateProductOrder ' + error.message);
                                    resUtil.resetFailedRes(error,res,next);
                                }else{
                                    logger.info('addUserProductOrder updateProductOrder  ' + 'success');
                                    resolve();
                                }
                            })
                        }).then(()=>{
                            let reqInfo={
                                saledQuantity:orderItemList[i].saledQuantity+1,
                                commodityId:orderItemList[i].commodityId,
                                status:sysConst.COMMODITY.status.onSale
                            }
                            if(orderItemList[i].quantity){
                                if(orderItemList[i].quantity <= reqInfo.saledQuantity ){
                                    reqInfo.status = sysConst.COMMODITY.status.reserved;//已预订
                                }
                            }
                            commodity.getAndUpdateSaledQuantityNum(reqInfo,(error,result)=>{
                                if(error){
                                    logger.error('addUserProductOrder getAndUpdateSaledQuantityNum ' + error.message);
                                    resUtil.resetFailedRes(error,res,next);
                                }else{
                                    logger.info('addUserProductOrder getAndUpdateSaledQuantityNum  ' + 'success');
                                }
                            });
                        })

                    })
                })
            })
            if (i == orderItemList.length - 1) {
                resUtil.resetCreateRes(res,resultCallback,null);
                return next();
            }
        }
    }).catch((reject)=>{
        if(reject.err){
            resUtil.resetFailedRes(res,reject.err);
        }else{
            resUtil.resetFailedRes(res,reject.msg);
        }
     })
}
const updateSendInfo = (req,res,next) => {
    let params = req.params;
    productOrderDAO.updateSendInfo(params,(error,result)=>{
        if(error){
            logger.error(' updateSendInfo ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' updateSendInfo ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const updateRemark = (req,res,next) => {
    let params = req.params;
    productOrderDAO.updateRemark(params,(error,result)=>{
        if(error){
            logger.error(' updateRemark ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' updateRemark ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const updateStatus = (req,res,next) => {
    let params = req.params;
    //订单状态（1:待发货 4:已发货 6:已取消  8:已送达 ）
    if((Number(params.status) != sysConst.PRODUCT_ORDER.status.shipped) & (Number(params.status) != sysConst.PRODUCT_ORDER.status.cancelled) & (Number(params.status) != sysConst.PRODUCT_ORDER.status.served)){
        logger.info(' updateStatus status error');
        resUtil.resetFailedRes(res,sysMsg.PRODUCT_ORDER_STATUS_ERROR);
        return next();
    }
    if(params.status == sysConst.PRODUCT_ORDER.status.shipped){
        //4.已发货
        params.departureTime = new Date();
    }
    if(params.status == sysConst.PRODUCT_ORDER.status.cancelled){
        //6.已取消
        params.cancelTime = new Date();
    }
    if(params.status == sysConst.PRODUCT_ORDER.status.served){
        //8.已送达
        params.arriveTime = new Date();
    }
    productOrderDAO.updateStatus(params,(error,result)=>{
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

module.exports={
    getPaymentStatus,
    getUserProductOrder,
    getUserProductOrderAndItem,
    getProductOrder,
    addUserProductOrder,
    updateSendInfo,
    updateStatus,
    updateRemark
}