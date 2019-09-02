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
const updateReminders = (req,res,next) => {
    let params = req.params;
    const getStatus =()=>{
        return new Promise((resolve, reject) => {
            remindersDAO.getReminders({reminderId:params.reminderId},(error,rows)=>{
                if(error){
                    logger.error(' updateReminders getStatus ' + error.message);
                    reject({err:error});
                    // resUtil.resInternalError(error,res,next);
                }else{
                    logger.info(' updateReminders getStatus ' + 'success');
                    if(rows.length>0){
                        if(rows[0].reminders_status == sysConst.REMINDERS_INFO.status.contacted){
                            logger.info('updateReminders  getStatus ' + 'No modification allowed!');
                            reject({msg:sysMsg.REMINDERS_STATUS_NO_MODIFY});
                        }else{
                            resolve();
                        }
                    }else{
                        logger.info('updateReminders  getStatus ' + 'reminders ID error!');
                        reject({msg:sysMsg.REMINDERS_ID_ERROR});
                    }
                }
            })
        });
    }
    const updateInfo =()=>{
        return new Promise(() => {
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
        });
    }

    getStatus()
        .then(updateInfo)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resetFailedRes(res,reject.err);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })

}
module.exports={
    getReminders,
    addReminders,
    updateReminders
}