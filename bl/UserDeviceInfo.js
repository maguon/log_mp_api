'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('UserDeviceInfo.js');
const userDeviceInfoDAO = require('../dao/UserDeviceInfoDAO.js');

const addUserDeviceInfo = (req,res,next)=>{
    let params = req.params;
    userDeviceInfoDAO.add(params,(error,result)=>{
        if(error){
            logger.error('addUserDeviceInfo ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('addUserDeviceInfo ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
};
module.exports={
    addUserDeviceInfo
}