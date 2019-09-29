'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
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
    const getReminder =()=>{
        return new Promise((resolve, reject) => {
            remindersDAO.getReminders(params,(error,rows)=>{
                if(error){
                    logger.error(' addReminders getReminder ' + error.message);
                    reject(error);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info(' addReminders getReminder ' + 'success');
                    if(rows.length <= 0){
                        resolve();
                    }else{
                        resUtil.resetFailedRes(res,null);
                    }
                }
            })
        });
    }
    const addRem =()=>{
        return new Promise(() => {
            params.remarks = '';
            params.status = 1;
            remindersDAO.addReminders(params,(error,result)=>{
                if(error){
                    logger.error('addReminders addRem ' + error.message);
                    resUtil.resetFailedRes(error,res,next);
                }else{
                    logger.info('addReminders addRem ' + 'success');
                    resUtil.resetCreateRes(res,result,null);
                    return next();
                }
            });
        });
    }
    getReminder()
        .then(addRem)
        .catch((reject)=>{
            resUtil.resetFailedRes(res,reject);
        })
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