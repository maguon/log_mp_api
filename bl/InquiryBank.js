'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('inquiryBank.js');
const inquiryBankDAO = require('../dao/InquiryBankDAO.js');

const getInquiryBank = (req,res,next) => {
    let params = req.params;
    inquiryBankDAO.getInquiryBank(params,(error,result)=>{
        if(error){
            logger.error('getInquiryBank' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getInquiryBank' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const addInquiryBank = (req,res,next) => {
    let params = req.params;
    inquiryBankDAO.addInquiryBank(params,(error,result)=>{
        if(error){
            logger.error('addInquiryBank' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('addInquiryBank' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const updateInquiryBank = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        inquiryBankDAO.updateInquiryBankStatus(params,(error,result)=>{
            if(error){
                logger.error('updateInquiryBankStatus' + error.message);
                reject();
            }else{
                logger.info('updateInquiryBankStatus'+'修改成功');
                resolve();
            }
        })
    }).then(()=>{
        new Promise((resolve,reject)=>{
            inquiryBankDAO.updateInquiryBank(params,(error,result)=>{
                if(error){
                    logger.error('updateInquiryBank' + error.message);
                    reject();
                }else{
                    logger.info('updateInquiryBank' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        })
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
}
const deleteUserBank = (req,res,next) => {
    let params = req.params;
    inquiryBankDAO.deleteById(params,(error,result)=>{
        if(error){
            logger.error('deleteUserBank :' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('deleteUserBank :' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    getInquiryBank,
    addInquiryBank,
    updateInquiryBank,
    deleteUserBank
}

