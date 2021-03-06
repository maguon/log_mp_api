'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const wechatUtil = require('../util/WechatUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const encrypt = require('../util/Encrypt.js');
const moment = require('moment/moment.js');
const sysConst = require("../util/SystemConst");
const sysConfig = require("../config/SystemConfig");
const logger = serverLogger.createLogger('ProductOrderPayment.js');
const productOrderDAO = require('../dao/ProductOrderDAO.js');
const productPaymentDAO = require('../dao/ProductPaymentDAO.js');
const commodityDAO = require('../dao/CommodityDAO.js');


const wechatPayment =(req,res,next)=>{
    let params = req.params;
    let ourString = encrypt.randomString();
    let requestIp = req.connection.remoteAddress.replace('::ffff:','');
    params.requestIp = requestIp;
    let wx_productOrderId = params.productOrderId+"_"+encrypt.randomString(6)+"_" + sysConst.SYSTEM_ORDER_TYPE.type.product;
    params.nonceStr = ourString;
    params.dateId = moment().format('YYYYMMDD');
    const getPayementStatus =()=>{
        return new Promise((resolve, reject) => {
            productOrderDAO.getUserProductOrder({orderId:params.productOrderId},(error,rows)=>{
                if(error){
                    logger.error('wechatPayment getPayementStatus ' + error.message);
                    resUtil.resInternalError(error, res, next);
                    reject({err:error});
                }else{
                    logger.info('wechatPayment getPayementStatus ' + 'success');
                    if(rows.length >0){
                        if (rows[0].payment_status == sysConst.PRODUCT_ORDER.payment_status.complete) {
                            reject({msg:sysMsg.ORDER_PAYMENT_STATUS_COMPLETE});
                        }else {
                            resolve();
                        }
                    }else{
                        reject({msg:sysMsg.PRODUCT_ORDER_ID_ERROR});
                    }
                }
            });
        });
    }
    const addPamentInfo =()=>{
        return new Promise((resolve, reject) => {
            params.status = sysConst.PRODUCT_PAYMENT.status.unPaid;//未付款
            params.type = sysConst.PRODUCT_PAYMENT.type.payment;//支付
            params.dateId = moment().format("YYYYMMDD");
            params.wxOrderId = wx_productOrderId;
            productPaymentDAO.addPayment(params,(error,result)=>{
                if(error){
                    logger.error('wechatPayment addPamentInfo ' + error.message);
                    reject(error);
                }else{
                    if(result && result.insertId < 1){
                        logger.warn('wechatPayment addPamentInfo '+'Failed to create payment information!');
                        resUtil.resetFailedRes(res,'创建支付信息失败',null);
                        reject(error);
                    }else{
                        logger.info('wechatPayment addPamentInfo '+'success');
                        resolve(params);
                    }
                }
            });
        });
    }
    const httpReques =(val)=>{
        return  new Promise((resolve, reject) => {
            //微信请求
            wechatUtil.wechatPaymentRequest(val,(error,result)=> {
                if (error) {
                    logger.error('wechatPayment httpReques ' + error.message);
                    reject({err: error});
                } else {
                    logger.info('wechatPayment httpReques ' + 'success');
                    let myDate = new Date();
                    let myDateStr = myDate.getTime() / 1000;
                    let parseIntDate = parseInt(myDateStr);
                    let paySignMD5 = encrypt.encryptByMd5NoKey('appId=' + sysConfig.wechatConfig.mpAppId + '&nonceStr=' + result.nonce_str + '&package=prepay_id=' + result.prepay_id + '&signType=MD5&timeStamp=' + parseIntDate + '&key=a7c5c6cd22d89a3eea6c739a1a3c74d1');
                    let paymentJson = [{
                        nonce_str: result.nonce_str,
                        prepay_id: result.prepay_id,
                        sign: result.sign,
                        timeStamp: parseIntDate,
                        paySign: paySignMD5,
                        resString: result.resString
                    }];
                    resUtil.resetQueryRes(res, paymentJson, null);
                }
            });
        });
    }
    getPayementStatus()
        .then(addPamentInfo)
        .then(httpReques)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resetFailedRes(res,reject.err);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
}
const updateOrderMsgByPrice = (params,callback)=>{
    let realPaymentPrice = 0;//实际支付总额（支付-退款）
    let paymentPrice =0; //实际支付总额
    let actTransPrice=0;//应付总售价
    let earnestMoney =0;//应付总定金
    let payment_type=0;
    let commodityId=0;//商品订单编号
    params.status = sysConst.PRODUCT_PAYMENT.status.paid;
    const getRealPaymentPrice =()=>{
        return new Promise((resolve, reject) => {
            productPaymentDAO.getRealPaymentPrice(params,(error,rows)=>{
                if(error){
                    logger.error('updateOrderMsgByPrice getPaymentByOrderId ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('updateOrderMsgByPrice getPaymentByOrderId ' + 'success');
                    if(rows.length > 0){
                        realPaymentPrice = rows[0].pay_price - Math.abs(rows[0].refund_price);//实际支付金额
                        paymentPrice = rows[0].pay_price;//支付总金额
                        resolve();
                    }else{
                        reject({msg:sysMsg.PRODUCT_PAYMENT_ID_ERROR});
                    }
                }
            });
        });
    }
    const getOrderInfo =()=>{
        return new Promise((resolve, reject) => {
            productOrderDAO.getProductOrder({productOrderId:params.productOrderId},(error,rows)=>{
                if(error){
                    logger.error('updateOrderMsgByPrice getOrderInfo ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('updateOrderMsgByPrice getOrderInfo ' + 'success');
                    if(rows.length){
                        actTransPrice = rows[0].act_trans_price;//售总价
                        earnestMoney = rows[0].earnest_money;//应支付总定金
                        payment_type = rows[0].type;//购付方式（1:全款购车 2:定金购车 3:货到付款）
                        commodityId = rows[0].commodity_id;
                        resolve();
                    }else{
                        reject({msg:sysMsg.PRODUCT_ORDER_ID_ERROR});
                    }
                }
            })
        });
    }
    const updateProductOrder =()=>{
        return new Promise((resolve, reject) => {
            if(params.type ==  sysConst.PRODUCT_PAYMENT.type.refund){
                params.paymentStatus = sysConst.PRODUCT_ORDER.payment_status.refund;
            }else{
                params.paymentStatus = sysConst.PRODUCT_ORDER.payment_status.complete;
            }
            params.realPaymentPrice = realPaymentPrice;
            productOrderDAO.updateStatusOrPrice(params,(error,result)=>{
                if(error){
                    logger.error('updateOrderMsgByPrice updateProductOrder ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('updateOrderMsgByPrice updateProductOrder ' + 'success');
                    resolve();
                }
            });
        });
    }
    const getCommodity =()=>{
        return new Promise((resolve, reject) => {
            commodityDAO.getCommodity({commodityId:commodityId},(error,rows)=>{
                if(error){
                    logger.error(' getCommodity ' + error.message);
                    reject({err:error});
                }else{
                    logger.info(' getCommodity ' + 'success');
                    if(rows.length>0){
                        resolve(rows[0]);
                        logger.info("commodityId:"+ commodityId);
                    }else{
                        reject({msg:sysMsg.COMMODITY_ID_ERROR});
                    }
                }
            })
        });
    }
    const getSaledQuantity = (commodityInfo)=>{
        return new Promise((resolve, reject) => {
            let paymentNumber = 0;
            let refundNumber = 0;
            //查询支付成功条数
            new Promise((resolve1, reject1) => {
                productPaymentDAO
                    .getCommodityPaymentStatus({type:sysConst.PRODUCT_PAYMENT.type.payment,status:sysConst.PRODUCT_PAYMENT.status.paid,commodityId:commodityId},(error,rows)=>{
                        if(error){
                            logger.error('updateOrderMsgByPrice getSaledQuantity payment ' + error.message);
                            reject1({err:error});
                        }else{
                            logger.info('updateOrderMsgByPrice getSaledQuantity payment ' + 'success');
                            logger.info("rows.length:"+rows.length);
                            paymentNumber = rows.length;
                            resolve1(commodityInfo);
                        }
                    });
            }).then(()=>{
                //退款成功条数
                productPaymentDAO.getCommodityPaymentStatus({type:sysConst.PRODUCT_PAYMENT.type.refund,status:sysConst.PRODUCT_PAYMENT.status.paid,commodityId:commodityId},(error,rows)=>{
                    if(error){
                        logger.error('updateOrderMsgByPrice getSaledQuantity refund  ' + error.message);
                        reject({err:error});
                    }else{
                        logger.info('updateOrderMsgByPrice getSaledQuantity refund ' + 'success');
                        logger.info("rows.length:"+rows.length);
                        refundNumber = rows.length;
                        commodityInfo.saled_quantity = paymentNumber - refundNumber;
                        if(commodityInfo.saled_quantity < 0 ){
                            commodityInfo.saled_quantity = 0;
                        }
                        resolve(commodityInfo);
                    }
                });
            })
        });
    }
    const updateCommodity =(commodityInfo)=>{
        return new Promise((resolve, reject)=>{
            logger.info("commodityInfo.saled_quantity:"+commodityInfo.saled_quantity);
            logger.info("commodityInfo.quantity:"+commodityInfo.quantity);
            if(commodityInfo.quantity){
                if(commodityInfo.quantity <= commodityInfo.saled_quantity ){
                    params.status = sysConst.COMMODITY.status.reserved;//已预订
                }else{
                    params.status = sysConst.COMMODITY.status.onSale;//在售
                }
            }
            commodityDAO.updateSaledQuantityOrStatus({saledQuantity:commodityInfo.saled_quantity,status:params.status,commodityId:commodityId},(error,result)=>{
                if(error){
                    logger.error(' updateOrderMsgByPrice updateCommodity ' + error.message);
                    reject({err:error});
                }else{
                    logger.info(' updateOrderMsgByPrice updateCommodity ' + 'success');
                    return callback(null,result);
                }
            })
        });
    }
    getRealPaymentPrice()
        .then(getOrderInfo)
        .then(updateProductOrder)
        .then(getCommodity)
        .then(getSaledQuantity)
        .then(updateCommodity)
        .catch((reject)=>{
            if(reject.err){
                return callback(reject.err,null);
            }else{
                return callback(reject.msg,null);
            }
        })
}
const productWechatPaymentCallback=(req,res,next) => {
        let result = req.result;
        let resString = JSON.stringify(result);
        let evalJson = eval('(' + resString + ')');
        //logger.info("wechatPaymentCallback177.toString: "+resString);
        logger.info("wechatPaymentCallback17777.body: "+req.body);
        let prepayIdJson = {
            nonceStr: evalJson.xml.nonce_str,
            openid: evalJson.xml.openid,
            productOrderId: parseInt(evalJson.xml.out_trade_no.split("_")[0]),
            transactionId: evalJson.xml.transaction_id,
            timeEnd: evalJson.xml.time_end,
            totalFee: evalJson.xml.total_fee / 100,
            status: sysConst.PRODUCT_PAYMENT.status.paid,
            type:sysConst.PRODUCT_PAYMENT.type.payment
        };
        const getPaymentInfo =()=>{
            return new Promise((resolve, reject) => {
                productPaymentDAO.getPaymentByOrderId({productOrderId:prepayIdJson.productOrderId},(error,rows)=>{
                    if(error){
                        logger.error('productWechatPaymentCallback getPaymentInfo ' + error.message);
                        reject({err:error});
                    }else{
                        if(rows && rows.length < 1){
                            logger.warn('productWechatPaymentCallback getPaymentInfo ' + 'This payment information is not available!');
                            reject({msg:sysMsg.PRODUCT_PAYMENT_ID_ERROR});
                        }else{
                            logger.info('productWechatPaymentCallback getPaymentInfo ' + 'success');
                            prepayIdJson.productPaymentId = rows[0].id;
                            prepayIdJson.type = rows[0].type;
                            prepayIdJson.pId = rows[0].p_id;
                            resolve();
                        }
                    }
                })
            });
        }
        const updatePaymentInfo =()=>{
            return new Promise((resolve, reject) => {
                if (prepayIdJson.type == sysConst.PRODUCT_PAYMENT.type.refund){
                    prepayIdJson.totalFee = -prepayIdJson.totalFee;
                    prepayIdJson.paymentRefundTime = new Date();
                    //更新源支付信息的退款时间
                    productPaymentDAO.updateWechatPayment({productPaymentId:prepayIdJson.pId,status:prepayIdJson.status,paymentRefundTime:prepayIdJson.paymentRefundTime},(error,result)=>{
                        if(error){
                            logger.error('productWechatPaymentCallback updatePIdRefundTime ' + error.message);
                            reject({err:error});
                        }else{
                            logger.info('productWechatPaymentCallback updatePIdRefundTime ' + 'success');
                        }
                    });
                }else{
                    prepayIdJson.paymentTime = new Date();
                }
                //更新退款信息的退款时间
                productPaymentDAO.updateWechatPayment(prepayIdJson,(error,result)=>{
                    if(error){
                        logger.error('productWechatPaymentCallback updatePaymentInfo ' + error.message);
                        reject({err:error});
                    }else{
                        logger.info('productWechatPaymentCallback updatePaymentInfo ' + 'success');
                        resolve();
                    }
                });
            });
        }
        const updateProductOrder =()=>{
            return new Promise(() => {
                let params ={
                    productOrderId: parseInt(evalJson.xml.out_trade_no.split("_")[0]),
                    type:prepayIdJson.type
                }
                updateOrderMsgByPrice(params,(error,result)=>{
                    if (error){
                        logger.error('productWechatPaymentCallback updateProductOrder ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    } else {
                        logger.info('productWechatPaymentCallback updateProductOrder ' + 'success');
                        resUtil.resetUpdateRes(res,result,null);
                        return next();
                    }
                })
            });
        }
        getPaymentInfo()
            .then(updatePaymentInfo)
            .then(updateProductOrder)
            .catch((reject)=> {
                if (reject.err) {
                    resUtil.resetFailedRes(res, reject.err);
                } else {
                    resUtil.resetFailedRes(res, reject.msg);
                }
            });
}
const updateRefundStatus = (req,res,next)=>{
    let params = req.params;
    let totalFee = 0;
    const getPaymentInfo =()=>{
        return new Promise((resolve, reject) => {
            //查询成功支付信息
            productPaymentDAO.getPayment({productOrderId:params.productOrderId,type:sysConst.PRODUCT_PAYMENT.type.payment,status:sysConst.PRODUCT_PAYMENT.status.paid},(error,rows)=>{
                if(error){
                    logger.error('updateRefundStatus getPaymentInfo ' + error.message);
                    reject({err:error});
                }else{
                    if(rows && rows.length < 1){
                        logger.warn('updateRefundStatus getPaymentInfo ' + 'Please check the payment information!');
                        reject({msg:sysMsg.PRODUCT_PAYMENT_ID_ERROR});
                    }else{
                        //若存在支付信息
                        if (rows[0].total_fee < params.refundFee) {
                            logger.error('updateRefundStatus getPaymentInfo ' + sysMsg.ADMIN_PAYMENT_REFUND_PRICE);
                            reject({msg:sysMsg.ADMIN_PAYMENT_REFUND_PRICE});
                        } else {
                            logger.info('updateRefundStatus getPaymentInfo ' + 'success');
                            totalFee = rows[0].total_fee;
                            params.paymentRefundId = rows[0].id;//支付信息编号
                            params.userId = rows[0].user_id;
                            params.wxOrderId = rows[0].wx_order_id;
                            resolve();
                        }
                    }
                }
            })
        });
    }
    const addRefund =()=>{
        return new Promise((resolve, reject) => {
            params.totalFee = 0 - params.refundFee;//要退款的金额
            params.dateId = moment(new Date()).format('YYYYMMDD');
            params.status = sysConst.PRODUCT_PAYMENT.status.paid;
            params.type = sysConst.PRODUCT_PAYMENT.type.refund;
            params.dateId = moment().format("YYYYMMDD");
            productPaymentDAO.addRefund(params,(error,result)=> {
                if (error) {
                    logger.error('updateRefundStatus addRefund ' + error.message);
                    reject({err:error});
                } else {
                    //成功添加退款信息
                    logger.info('updateRefundStatus addRefund ' + ' success');
                    params.refundId = result.insertId;//退款编号
                    resolve();
                }
            });
        });
    }
    const wechatReq = ()=>{
        return new Promise((resolve, reject) => {
            params.totalFee = 0 - params.totalFee;//要退款的金额
            //微信请求
            wechatUtil.wechatRequest(params,(error,result)=>{
                if (error){
                    logger.error('updateRefundStatus wechatRequest ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('updateRefundStatus wechatRequest ' + 'success');
                    if('FAIL' == result.return_code ){
                        //请求失败
                        productPaymentDAO.delRefundFail(params, () => {
                            logger.info('updateRefundStatus wechatRequest delRefundFail ' + 'success');
                        });
                        logger.warn('updateRefundStatus wechatRequest Refund failure!');
                        resUtil.resetFailedRes(res, result, null);
                    }else{
                        //请求退款成功
                        logger.info("updateRefundStatus wechatRequest Refund SUCCESS!");
                        resUtil.resetQueryRes(res, result, null);
                        return next();
                    }
                }
            });
        });
    }
    getPaymentInfo()
        .then(addRefund)
        .then(wechatReq)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resetFailedRes(res,reject.err);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
}
const getPayment = (req,res,next)=>{
    let params = req.params;
    productPaymentDAO.getPayment(params,(error,result)=>{
        if(error){
            logger.error('getPayment ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getPayment ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const updateRemark = (req,res,next)=>{
    let params = req.params;
    productPaymentDAO.updateRemark(params,(error,result)=>{
        if(error){
            logger.error('updateRemark ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateRemark ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
module.exports = {
    wechatPayment,
    productWechatPaymentCallback,
    updateRefundStatus,
    getPayment,
    updateRemark
}