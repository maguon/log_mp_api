'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require("../util/SystemMsg");
const logger = serverLogger.createLogger('UserCoupon.js');
const adminUserDao = require('../dao/AdminUserDAO.js');
const userCouponDao = require('../dao/UserCouponDAO.js');
const userDao = require('../dao/UserDAO.js');


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

    const getAdminUserInfo = () => {
        return new Promise((resolve, reject) =>{
            adminUserDao.queryAdminInfo(params.adminId,(error,rows)=>{
                if(error){
                    logger.error(' addUserCoupon getAdminUserInfo ' + error.message);
                    reject({err:error});
                }else{
                    logger.info(' addUserCoupon getAdminUserInfo ' + 'success');
                    if(rows.length > 0){
                        params.adminName = rows[0].real_name;
                        resolve();
                    }else{
                        reject({msg:sysMsg.ADMIN_UNREGISTERED});
                    }
                }
            })
        });
    }
    const queryUser = ()=>{
        return new Promise((resolve, reject) =>{
            userDao.queryUser(params.userId,(error,rows)=>{
                if(error){
                    logger.error('addUserCoupon queryUser ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('addUserCoupon queryUser ' + 'success');
                    if(rows.length > 0){
                        params.userName = rows[0].user_name;
                        params.phone = rows[0].phone;
                        resolve();
                    }else{
                        reject({msg:sysMsg.USER_UNREGISTERED});
                    }
                }
            });
        });
    };
    const addUserCoupon =()=>{
        return new Promise(() => {
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
        });
    }
    getAdminUserInfo()
        .then(queryUser)
        .then(addUserCoupon)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resetFailedRes(res,reject.err);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
};
module.exports={
    getUserCoupon,
    addUserCoupon,
}