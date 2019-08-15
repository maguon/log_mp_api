'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Coupon.js');
const couponDao = require('../dao/CouponDAO.js');
const sysConsts = require("../util/SystemConst");

const getCoupon = (req,res,next) => {
    let params = req.params;
    couponDao.getCoupon(params,(error,rows)=>{
        if(error){
            logger.error(' getCoupon ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' getCoupon ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
const addCoupon = (req,res,next)=>{
    let params = req.params;
    couponDao.addCoupon(params,(error,result)=>{
        if(error){
            logger.error('addCoupon ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('addCoupon ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
};
const updateCoupon = (req,res,next) => {
    let params = req.params;

    const getDelStatus = ()=>{
        return new Promise((resolve, reject) => {
            couponDao.getCoupon({couponId:params.couponId},(error,rows)=>{
                if(error){
                    logger.error('updateCoupon getDelStatus ' + error.message);
                    reject({err:error});
                    // resUtil.resInternalError(error,res,next);
                } else {
                    logger.info(' updateCoupon getDelStatus ' + 'success');
                    if(rows.length>0){
                        let delStatus = rows[0].del_status;
                        if(delStatus ==1 ){
                            reject({msg:sysMsg.COUPON_NOT_MODIFIED});
                        }else{
                            resolve();
                        }
                    }else{
                        reject({msg:sysMsg.COUPON_NO_EXISTS});
                    }
                }
            })
        });
    }
    const updateInfo =()=>{
        return new Promise(() =>{
            couponDao.updateCoupon(params,(error,result)=>{
                if(error){
                    logger.error('updateCoupon updateInfo ' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                }else{
                    logger.info('updateCoupon  updateInfo ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        });
    }

    getDelStatus()
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
    couponDao.updateStatus(params,(error,result)=>{
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
    getCoupon,
    addCoupon,
    updateCoupon,
    updateStatus
}