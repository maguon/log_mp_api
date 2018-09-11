'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('User.js');
const userDao = require('../dao/UserDAO.js');
const encrypt = require('../util/Encrypt.js');

const updateUser = (req,res,next)=>{
    let params = req.params;
     userDao.updateUser(params,(error,result)=>{
         if(error){
             logger.error('updateUser' + error.message);
             throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
         }else{
             logger.info('updateUser' + 'success');
             resUtil.resetUpdateRes(res,result,null);
             return next();
         }
     });

};
const updatePassword=(req,res,next)=>{
    let params = req.params;
    userDao.queryUser(params,(error,rows)=>{
        if(error){
            logger.error('updatePassword' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            if(rows && rows.length < 1){
                logger.warn('updatePassword' + "尚未注册");
                resUtil.resetFailedRes(res,"尚未注册");
                return next();
            }else
                var md5Password = encrypt.encryptByMd5(params.oldPassword);
                //console.log(md5Password);
                if(md5Password != rows[0].password){
                    //console.log(rows[0].password);
                logger.warn('updatePassword' + "原密码错");
                resUtil.resetFailedRes(res,"原密码错误");
                return next();
            }else{
                params.newPassword = encrypt.encryptByMd5(params.newPassword);
                userDao.updatePassword(params,(error,result)=>{
                    if(error){
                        logger.error('updatePassword' + error.message);
                        throw sysError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }else{
                        logger.info('updatePassword' + 'success');
                        resUtil.resetUpdateRes(res,result,null);
                        return next();
                    }
                })
            }
        }
    });
};
const updateStatus=(req,res,next)=>{
    var params = req.params;
    userDao.updateStatus(params,(error,result)=>{
        if(error){
            logger.error('updateStatus' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const updatePhone=(req,res,next)=>{
    let params = req.params;
    userDao.updatePhone(params,(error,result)=>{
        if(error){
            logger.error('updatePhone' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updatePhone' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const queryUser = (req,res,next)=>{
    let params = req.params;
    userDao.queryUser(params,(error,result)=>{
        if(error){
            logger.error('queryUser' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('queryUser' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
const userLogin = (req,res,next)=>{
    let params = req.params;
     userDao.getUser({wechatId:params.wechatId},(error,rows)=>{
        if(error){
            logger.error('userLogin'+error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            if(rows && rows.length < 1){
                params.password = encrypt.encryptByMd5(params.password)
                userDao.createUser(params,(error,result)=>{
                    if(error) {
                        logger.error('createUser' + error.message);
                        throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }
                    else
                        if (result && result != null) {
                            logger.info('create' + 'success');
                            resUtil.resetCreateRes(res,result,null);
                            return next();
                            }
                });
            } else{
                const resObj ={
                    userId: rows[0].id,
                    wechatAccount : rows[0].wechat_account,
                    phone : rows[0].phone
                }
                resUtil.resetQueryRes(res,resObj,null);
                var myDate = new Date();
                params.lastLoginOn = myDate;
                userDao.lastLoginOn({wechatId:params.wechatId,lastLoginOn:params.lastLoginOn},(error,rows));
                return next();
            }
        }
    });
};

module.exports ={
    queryUser,
    userLogin,
    updateUser,
    updatePassword,
    updateStatus,
    updatePhone
};