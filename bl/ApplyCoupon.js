'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require("../util/SystemMsg");
const logger = serverLogger.createLogger('ApplyCoupon.js');
const applyCouponDao = require('../dao/ApplyCouponDAO.js');
const orderInvoiceDAO = require('../dao/OrderInvoiceApplyDAO');

const getApplyCoupon = (req,res,next) => {
    let params = req.params;
    const getApplyCoupon = ()=>{
        return new Promise((resolve, reject) => {
            applyCouponDao.getApplyCoupon(params,(error,rows)=>{
                if(error){
                    logger.error(' getApplyCoupon ' + error.message);
                    reject({err:error});
                }else{
                    logger.info(' getApplyCoupon ' + 'success');
                    resolve(rows[0]);
                }
            })
        });
    }
    const getOrder =(applyCouponInfo)=>{
        return new Promise(() => {
            orderInvoiceDAO.getOrderInvoice({orderId:applyCouponInfo.order_id},(error,rows)=>{
                if (error){
                    logger.error('getNoInvoiceOrderList ' + error.message);
                    resUtil.resInternalError(error,res,next);
                } else {
                    if(rows.length > 0){
                        logger.info('getNoInvoiceOrderList ' + 'success');
                        let orderInfo={};
                        orderInfo.route_start_id = rows[0].route_start_id;//起运地ID
                        orderInfo.route_start = rows[0].route_start;//起运地
                        orderInfo.route_end_id = rows[0].route_end_id;//目的地ID
                        orderInfo.route_end = rows[0].route_end;//目的地
                        orderInfo.service_type = rows[0].service_type;//上门服务，自提
                        orderInfo.car_num = rows[0].car_num;//车数量
                        orderInfo.status = rows[0].status;//状态
                        orderInfo.departure_time = rows[0].departure_time;//出发时间
                        orderInfo.admin_id = rows[0].admin_id;//创建人
                        orderInfo.total_trans_price = rows[0].total_trans_price;//应付总运费
                        orderInfo.total_insure_price = rows[0].total_insure_price;//应付总保费
                        orderInfo.created_on = rows[0].created_on;//创建时间
                        applyCouponInfo.orderInfo = orderInfo
                        resUtil.resetQueryRes(res,applyCouponInfo,null);
                        return next();
                    }else{
                        resUtil.resetQueryRes(res,null,"没有相关订单信息");
                        return next();
                    }
                }
            });
        });
    }
    getApplyCoupon()
        .then(getOrder)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resetFailedRes(res,reject.err);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })

}
module.exports={
    getApplyCoupon
}