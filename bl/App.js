'user strict'
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('App.js');
const appDao = require('../dao/AppDAO.js');

const getApp = (req,res,next) => {
    let params = req.params;
    appDao.getApp(params,(error,rows)=>{
        if(error){
            logger.error(' getApp ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info(' getApp ' + 'success');
            resUtil.resetQueryRes(res,rows[0],null);
            return next();
        }
    })
}
const addApp = (req,res,next)=>{
    let params = req.params;
    appDao.addApp(params,(error,result)=>{
        if(error){
            logger.error('appDAO ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('appDAO ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
};
const updateApp = (req,res,next) => {
    let params = req.params;
    appDao.updateApp(params,(error,result)=>{
        if(error){
            logger.error('updateApp ' + error.message);
            resUtil.resetFailedRes(error,res,next);
        }else{
            logger.info('updateApp  ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

module.exports={
    getApp,
    addApp,
    updateApp
}