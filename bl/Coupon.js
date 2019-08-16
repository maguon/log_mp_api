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
    if(params.couponType == 0 ){
        params.start_date = '';
        params.end_date = '';
    }else{
        params.effectiveDays = 0;
    }
    params.status = 1;
    params.delStatus = 0;
    params.showStatus = 0;

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
    if(params.couponType == 0 ){
        params.start_date = '';
        params.end_date = '';
    }else{
        params.effectiveDays = 0;
    }
    params.status = 1;
    params.delStatus = 0;
    params.showStatus = 0;
    couponDao.updateCoupon(params,(error,result)=>{
        if(error){
            logger.error('updateCoupon ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('updateCoupon  ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
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
const deleteCoupon = (req,res,next) => {
    let params = req.params;

    const getDelStatus = ()=>{
        return new Promise((resolve, reject) => {
            couponDao.getCoupon({couponId:params.couponId},(error,rows)=>{
                if(error){
                    logger.error('deleteCoupon getDelStatus ' + error.message);
                    reject({err:error});
                } else {
                    logger.info(' deleteCoupon getDelStatus ' + 'success');
                    if(rows.length>0){
                        let delStatus = rows[0].del_status;
                        if(delStatus ==1 ){
                            reject({msg:sysMsg.COUPON_NOT_DELETE});
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
    const deleteInfo =()=> {
        return new Promise(() => {
            couponDao.deleteCoupon(params,(error,result)=>{
                if(error){
                    logger.error(' deleteCoupon deleteInfo ' + error.message);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info(' deleteCoupon deleteInfo ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        });
    }
    getDelStatus()
        .then(deleteInfo)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resetFailedRes(res,reject.err);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
}
module.exports={
    getCoupon,
    addCoupon,
    updateCoupon,
    updateStatus,
    deleteCoupon
}