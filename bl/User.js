const wechatBl = require('../bl/wechatBl.js');
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('User.js');
const userDao = require('../dao/UserDAO.js');

const updateUser = (req,res,next)=>{
     var params = req.params;


}

const userLogin = (req,res,next)=>{
     var params = req.params;
     userDao.getUser(params,(error,rows)=>{
        if(error){
            logger.error('userLogin'+error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            if(rows && rows.length<1){
                userDao.createUser(params,function(error,result){
                    if(error) {
                        logger.error('createUser' + error.message);
                        throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }
                    else
                        if (result && result.insertId > 0) {
                            logger.info('create' + 'success');
                            var user = {
                                    userId : result.insertId,

                                    openid : result.openid
                            };
                            //logger.warn('createUser' + 'false');
                            //resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                            resUtil.resetCreateRes(res, result, null);
                            }


                });
            }

            else{
                var user={
                    userId : rows[0].user_id,
                    userName : rows[0].user_name,
                    openid : rows[0].openid

                }
                resUtil.resetQueryRes(res,user,null);
            }
        }
    });

}

module.exports ={
    userLogin,
    updateUser
}