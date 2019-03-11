'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('City.js');
const trans = require("transliteration");
const cityInfoDAO = require('../dao/CityInfoDAO.js');

const addCity = (req,res,next) =>{
    let params = req.params;
    cityInfoDAO.queryCity(params,(error,rows)=>{
        if(error){
            logger.error('queryCity' + error.message);
            resUtil.resInternalError(error,res,next);
        }else if(rows && rows.length < 1){
            let pinyin = trans.slugify(params.cityName);
            params.cityPinYin = pinyin.replace(new RegExp("-","g"),"");
            params.cityPY = "";
            let index = pinyin.split("-");
            for (let i =0;i<index.length;i++){
                params.cityPY += index[i].substr(0,1);
            }
            cityInfoDAO.addCity(params,(error,result)=>{
                if(error){
                    logger.error('addCity' + error.message);
                    resUtil.resInternalError(error,res,next);
                }else{
                    logger.info('addCity' + 'success');
                    resUtil.resetCreateRes(res,result,null);
                    return next();
                }
            })
        }else{
            logger.warn('queryCity' + '已经添加该城市');
            resUtil.resetFailedRes(res,'已经添加该城市');
            return next();
        }
    })
}
const queryCity = (req,res,next) => {
    let params = req.params;
    cityInfoDAO.queryCity(params,(error,result)=>{
        if(error){
            logger.error('queryCity' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('queryCity' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const updateCity = (req,res,next) =>{
    let params = req.params;
    cityInfoDAO.updateCity(params,(error,result)=>{
        if(error){
            logger.error('updateCity' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateCity' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const queryCityAdmin = (req,res,next) => {
    let params = req.params;
    cityInfoDAO.queryCityAdmin(params,(error,result)=>{
        if(error){
            logger.error('queryCityAdmin' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('queryCityAdmin' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addCity,
    queryCity,
    updateCity,
    queryCityAdmin
}
