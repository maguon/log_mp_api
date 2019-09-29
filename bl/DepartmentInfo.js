'use strict';

const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const logger = serverLogger.createLogger('DepartmentInfo.js');
const departmentInfoDAO = require("../dao/DepartmentInfoDAO");

const addDepartmentInfo =(req,res,next)=>{
    let params = req.params;
    departmentInfoDAO.insert(params,(error,result)=>{
        if (error){
            logger.error('addDepartmentInfo ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info('addDepartmentInfo ' + 'success');
            resUtil.resetCreateRes(res,result, next);
        }
    })
}
const getDepartmentInfo =(req,res,next)=>{
    let params = req.params;
    departmentInfoDAO.get(params,(error,result)=>{
        if (error){
            logger.error('getDepartmentInfo ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info('getDepartmentInfo ' + 'success');
            resUtil.resetQueryRes(res,result, next);
        }
    })
}
const updateDepartmentInfo =(req,res,next)=>{
    let params = req.params;
    departmentInfoDAO.updateById(params,(error,result)=>{
        if (error){
            logger.error('updateDepartmentName ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info('updateDepartmentName ' + 'success');
            resUtil.resetUpdateRes(res,result, next);
        }
    })
}
module.exports = {
    addDepartmentInfo,
    getDepartmentInfo,
    updateDepartmentInfo
}