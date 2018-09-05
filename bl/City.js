'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('City.js');
const cityDAO = require('../dao/CityDAO.js');

const addCity = (req,res,next) =>{
    let params = req.params;
    cityDAO.addCity(params,(error,result)=>{
        if(error){
            logger.error('addCity' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addCity' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const queryCity = (req,res,next) => {
    let params = req.params;
    cityDAO.queryCity(params,(error,result)=>{
        if(error){
            logger.error('queryCity' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('queryCity' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const updateCity = (req,res,next) =>{
    let params = req.params;
    cityDAO.updateCity(params,(error,result)=>{
        if(error){
            logger.error('updateCity' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateCity' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

module.exports = {
    addCity,
    queryCity,
    updateCity
}
