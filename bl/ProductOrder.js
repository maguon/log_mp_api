'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require("../util/SystemMsg");
const sysConst = require("../util/SystemConst");
const moment = require('moment/moment.js');
const logger = serverLogger.createLogger('ProductOrder.js');
const productOrderDAO = require('../dao/ProductOrderDAO.js');
const productOrderItemDAO = require('../dao/ProductOrderItemDAO');
const commodityDAO = require('../dao/CommodityDAO');

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
    let oraTransPrice = 0;//原总价
    let actTransPrice = 0;//售总价
    let earnestMoney = 0;//应支付总定金
    params.paymentEarnestMoney = 0;//支付总金额
    params.paymentStatus = sysConst.PRODUCT_ORDER.payment_status.unPaid;//支付状态（1:未支付 2:部分支付 3.支付完成 4.已退款）
    params.status = sysConst.PRODUCT_ORDER.status.tpShipped;//订单状态（1:待发货 2:已发货 3:已送达 4.已完成 5:已取消）
    params.dateId = moment().format("YYYYMMDD");

    let resultCallback;
    const addProductOrder =()=>{
        return new Promise((resolve, reject)=>{
            productOrderDAO.addProductOrder(params,(error,result)=>{
                if(error){
                    logger.error('addUserProductOrder addProductOrder ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('addUserProductOrder addProductOrder ' + 'success');
                    resultCallback = result;
                    resolve(result.insertId);
                }
            });
        });
    }
    const getCommeodiy =(ProductOrderId)=>{
        return new Promise((resolve, reject) => {
            let orderItemList = params.productOrderItemArray;
                commodityDAO.getCommodity({commodityId:orderItemList[0].commodityId},(error,rows)=>{
                    if(error){
                        logger.error(' addUserProductOrder getCommeodiy ' + error.message);
                        reject({err:error});
                    }else{
                        logger.info(' addUserProductOrder getCommeodiy ' + 'success');
                        if(rows.length){
                            let commodityList = rows[0];
                            orderItemList[0].commodityName = commodityList.commodity_name;//商品名称
                            orderItemList[0].cityId = commodityList.city_id;//城市编号
                            orderItemList[0].cityName = commodityList.city_name;//城市名称
                            orderItemList[0].type = commodityList.type;//购付类型
                            orderItemList[0].originalPrice = commodityList.original_price;
                            orderItemList[0].actualPrice = commodityList.actual_price;
                            orderItemList[0].earnestMoney = commodityList.earnest_money;

                            oraTransPrice += commodityList.original_price;//原价
                            actTransPrice += commodityList.actual_price;//售价
                            earnestMoney += commodityList.earnest_money;//应付定金
                            resolve(ProductOrderId);
                        }else{
                            reject({msg:sysMsg.COMMODITY_ID_ERROR});
                        }
                    }
                })

        });
    }
    const addProductOrderItem =(ProductOrderId)=>{
        return new Promise((resolve, reject) => {
            let orderItemList = params.productOrderItemArray;
            orderItemList[0].productOrderId = ProductOrderId;//订单编号
            productOrderItemDAO.addProductOrderItem(orderItemList[0],(error,result)=>{
                if(error){
                    logger.error('addUserProductOrder addProductOrderItem commodityId:' + orderItemList[0].commodityId +error.message);
                    reject({err:error})
                }else{
                    logger.info('addUserProductOrder addProductOrderItem commodityId:' + orderItemList[0].commodityId +' success');
                    resolve(ProductOrderId);
                }
            });
        });
    }

    const updateProductOrder =(ProductOrderId)=>{
        return new Promise((resolve, reject) => {
            params.oraTransPrice = oraTransPrice;
            params.actTransPrice = actTransPrice;
            params.earnestMoney = earnestMoney;
            params.productOrderId =  ProductOrderId;

            productOrderDAO.updateProductOrder(params,(error,result)=>{
                if(error){
                    logger.error('addUserProductOrder updateProductOrder ' + error.message);
                    reject({err:error});
                    resUtil.resetFailedRes(error,res,next);
                }else{
                    logger.info('addUserProductOrder updateProductOrder  ' + 'success');
                    resUtil.resetUpdateRes(res,resultCallback,null);
                    return next();
                }
            })
        });
    }
    addProductOrder()
        .then(getCommeodiy)
        .then(addProductOrderItem)
        .then(updateProductOrder)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resetFailedRes(res,reject.err);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
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
    //订单状态（1:待发货 2:已发货 3:已送达 4.已完成 5:已取消）
    if(params.status == sysConst.PRODUCT_ORDER.status.shipped){
        //2.已发货
        params.departureTime = moment().format("YYYY-MM-DD HH:MM:SS");
    }
    if(params.status == sysConst.PRODUCT_ORDER.status.served){
        //3.已送达
        params.arriveTime = moment().format("YYYY-MM-DD HH:MM:SS");
    }
    if(params.status == sysConst.PRODUCT_ORDER.status.completed){
        //4.已完成
        params.receivingGoodsTime = moment().format("YYYY-MM-DD HH:MM:SS");
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
    getUserProductOrder,
    getProductOrder,
    addUserProductOrder,
    updateStatus,
    updateRemark
}