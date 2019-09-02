'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require("../util/SystemMsg");
const logger = serverLogger.createLogger('Reminders.js');
const remindersDAO = require('../dao/RemindersDAO.js');

const getReminders = (req,res,next) => {
    let params = req.params;
    remindersDAO.getReminders(params,(error,rows)=>{
        if(error){
            logger.error(' getReminders ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' getReminders ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
const addReminders = (req,res,next) =>{
    let params = req.params;
    params.remarks = '';
    params.status = 0;
    remindersDAO.addReminders(params,(error,result)=>{
        if(error){
            logger.error('addReminders ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('addReminders ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const updateRemarks = (req,res,next) => {
    let params = req.params;
    remindersDAO.updateRemarks(params,(error,result)=>{
        if(error){
            logger.error(' updateRemarks ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' updateRemarks ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const updateStatus = (req,res,next) => {
    let params = req.params;
    remindersDAO.updateStatus(params,(error,result)=>{
        if(error){
            logger.error(' updateStatus ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' updateStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports={
    getReminders,
    addReminders,
    updateRemarks,
    updateStatus
}