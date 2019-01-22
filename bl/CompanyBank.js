'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('CompanyBank.js');
const companyBankDAO = require('../dao/CompanyBankDAO.js');

const addCompanyBank = (req,res,next) => {
    let params = req.params;
    companyBankDAO.add(params,(error,rows)=>{
        if(error){
            logger.error(' addCompanyBank ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' addCompanyBank ' + 'success');
            resUtil.resetCreateRes(res,rows,null);
            return next();
        }
    })
}
const updateCompanyBank = (req,res,next) => {
    let params = req.params;
    companyBankDAO.updateById(params,(error,rows)=>{
        if(error){
            logger.error(' updateCompanyBank ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' updateCompanyBank ' + 'success');
            resUtil.resetUpdateRes(res,rows,null);
            return next();
        }
    })
}
const getCompanyBank = (req,res,next) => {
    let params = req.params;
    companyBankDAO.selectById(params,(error,rows)=>{
        if(error){
            logger.error(' getCompanyBank ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' getCompanyBank ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
module.exports ={
    addCompanyBank,
    updateCompanyBank,
    getCompanyBank
}