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
    params.status = 1;
    params.showStatus = 0;

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
const updateUserCoupon = (req,res,next) => {
    let params = req.params;
    params.status = 1;
    params.showStatus = 0;
    userCouponDao.updateUserCoupon(params,(error,result)=>{
        if(error){
            logger.error('updateUserCoupon ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('updateUserCoupon  ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const updateStatus = (req,res,next) => {
    let params = req.params;
    userCouponDao.updateStatus(params,(error,result)=>{
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
const deleteUserCoupon = (req,res,next) => {
    let params = req.params;
    userCouponDao.deleteUserCoupon(params,(error,result)=>{
        if(error){
            logger.error(' deleteUserCoupon ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' deleteUserCoupon ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports={
    getUserCoupon,
    addUserCoupon,
    updateUserCoupon,
    updateStatus,
    deleteUserCoupon
}