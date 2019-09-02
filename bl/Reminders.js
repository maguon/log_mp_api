'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require("../util/SystemMsg");
const sysConst = require("../util/SystemConst");
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
    params.status = 1;
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
const updateReminders = (req,res,next) => {
    let params = req.params;
    remindersDAO.updateReminders(params,(error,result)=>{
        if(error){
            logger.error(' updateReminders ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' updateReminders ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports={
    getReminders,
    addReminders,
    updateReminders
}