const wechatDAO = require('../dao/WechatDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('WechatBl.js');

const getUserIdByCode = (req,res,next) =>{
    wechatDAO.getUserIdByCode(req.params,(error,result)=>{
        if (error) {
            logger.error(' getUserIdByCode ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{

            logger.info(' getUserIdByCode ' + 'success')
            resUtil.resetQueryRes(res, result);

        }
    })
}

const getUserById = (req,res,next) => {

}

module.exports ={
    getUserIdByCode
}
