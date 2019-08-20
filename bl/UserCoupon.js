'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('UserCoupon.js');
const userCouponDao = require('../dao/UserCouponDAO.js');

const getUserCoupon = (req,res,next) => {
    let params = req.params;
    userCouponDao.getUserCoupon(params,(error,rows)=>{
        if(error){
            logger.error(' getUserCoupon ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' getUserCoupon ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
const addUserCoupon = (req,res,next)=>{
    let params = req.params;
    if(params.couponType == 0 ){
        params.startDate = '';
        params.endDate = '';
    }else{
        params.effectiveDays = 0;
    }
    params.status = 1;
    params.couponId = "0";
    params.couponName = "专属优惠卷";
    params.floorPrice = 0;
    userCouponDao.addUserCoupon(params,(error,result)=>{
        if(error){
            logger.error('addUserCoupon ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('addUserCoupon ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
};
module.exports={
    getUserCoupon,
    addUserCoupon,
}