const wechatBl = require('../bl/wechatBl.js');
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('User.js');
const userDao = require('../dao/UserDAO.js');
const encrypt = require('../util/Encrypt.js');

const updateUser = (req,res,next)=>{
    var params = req.params;
     userDao.updateUser(params,(error,result)=>{
         if(error){
             logger.error('updateUser' + error.message);
             throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
         }else{
             logger.info('updateUser' + 'success');
             resUtil.resetUpdateRes(res,result,null);
         }
     });

}
const updatePassword=(req,res,next)=>{
    let params = req.params;
    userDao.getUser(params,(error,rows)=>{
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
                console.log(md5Password);
                if(md5Password != rows[0].password){
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
}
const queryUser = (req,res,next)=>{
    var params = req.params;
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
}
const userLogin = (req,res,next)=>{
    var params = req.params;
     userDao.getUser(params,(error,result)=>{
        if(error){
            logger.error('userLogin'+error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            if(result && result==""){
                userDao.createUser(params,function(error,result){
                    if(error) {
                        logger.error('createUser' + error.message);
                        throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }
                    else
                        if (result && result.insertId > 0) {
                            logger.info('create' + 'success');
                            let user = {
                                    userId : result.insertId,
                                    openid : result.openid
                            };
                            //logger.warn('createUser' + 'false');
                            //resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                            resUtil.resetCreateRes(res, result, null);
                            return next();
                            }


                });
            }   else{
                resUtil.resetQueryRes(res,result,null);
            }
        }
    });

}

module.exports ={
    queryUser,
    userLogin,
    updateUser,
    updatePassword
}