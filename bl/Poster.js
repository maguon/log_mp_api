'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('Poster.js');
const posterDAO = require("../dao/PosterDAO");

const addPoster = (req,res,next)=>{
    let params = req.params;
    params.viewCount = 0;
    posterDAO.add(params,(error,rows)=>{
        if(error){
            logger.error('addPoster ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('addPoster ' + 'success');
            resUtil.resetCreateRes(res,rows,null);
            return next;
        }
    });
}
const getPoster = (req,res,next)=>{
    let params = req.params;
    posterDAO.select(params,(error,result)=>{
        if(error){
            logger.error('getPoster ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getPoster ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });

}
const updatePoster = (req,res,next)=>{
    let params = req.params;
    posterDAO.update(params,(error,result)=>{
        if(error){
            logger.error('updatePoster ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updatePoster ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
module.exports={
    addPoster,
    getPoster,
    updatePoster
}