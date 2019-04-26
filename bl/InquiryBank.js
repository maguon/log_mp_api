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
            logger.error('getInquiryBank ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('getInquiryBank ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const addInquiryBank = (req,res,next) => {
    let params = req.params;
    inquiryBankDAO.addInquiryBank(params,(error,result)=>{
        if(error){
            logger.error('addInquiryBank ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('addInquiryBank ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const updateInquiryBank = (req,res,next) => {
    let params = req.params;
    const updateStatus = () =>{
        return new Promise((resolve,reject)=>{
            inquiryBankDAO.updateInquiryBankStatus(params,(error,result)=>{
                if(error){
                    logger.error('updateInquiryBank updateStatus ' + error.message);
                    reject(error);
                }else{
                    logger.info('updateInquiryBank updateStatus '+'Modify the success!');
                    resolve(params);
                }
            })
        });
    }
    const updateBank = (inquiryBank) =>{
        return new Promise((resolve,reject)=>{
            inquiryBankDAO.updateInquiryBank(inquiryBank,(error,result)=>{
                if(error){
                    logger.error('updateInquiryBank updateBank ' + error.message);
                    reject(error);
                }else{
                    logger.info('updateInquiryBank updateBank ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        });
    }
    updateStatus()
        .then(updateBank)
        .catch((reject)=>{
            resUtil.resInternalError(reject.err,res,next);
        })
}
const deleteUserBank = (req,res,next) => {
    let params = req.params;
    inquiryBankDAO.deleteById(params,(error,result)=>{
        if(error){
            logger.error('deleteUserBank ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('deleteUserBank ' + 'success');
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

