'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Route.js');
const routeDAO = require('../dao/RouteDAO.js');

const addRoute = (req,res,next) =>{
    let params = req.params;
    routeDAO.addRoute(params,(error,result)=>{
        if(error){
            logger.error('addRoute' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addRoute' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

const queryRoute = (req,res,next) =>{
    let params = req.params;
    let paramsNull = [];
    routeDAO.getRoute(params,(error,rows)=>{
        if(error){
            logger.error('addRoute' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }
        else if(rows && rows.length < 1){
            logger.warn('queryRouteInquiry' + sysMsg.SYS_INQUIRY_ERROR_MSG);
            resUtil.resetQueryRes(res,paramsNull);
            return next();
        }else{
            let route = [{
                routeId: rows[0].route_id,
                routeStartId: rows[0].route_start_id,
                routeEndId: rows[0].route_end_id,
                distance: rows[0].distance
        }]
            logger.info('queryRoute' + 'success');
            resUtil.resetQueryRes(res,route,null);
            return next();
        }
    })
}
const updateRoute = (req,res,next) => {
    let params = req.params;
    if(params.routeStartId > params.routeEndId){
        params.routeNewId = parseInt(params.routeEndId.toString() + params.routeStartId.toString());
    }else{
        params.routeNewId = parseInt(params.routeStartId.toString() + params.routeEndId.toString());
    }
    routeDAO.updateRoute(params,(error,result)=>{
        if(error){
            logger.error('updateRoute' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateRoute' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addRoute,
    queryRoute,
    updateRoute
}