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
    const getCity = () =>{
        return new Promise((resolve,reject)=>{
            cityInfoDAO.queryCity(params,(error,rows)=> {
                if (error) {
                    logger.error('addCity queryCity ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    if(rows && rows.length < 1) {
                        logger.warn('addCity getCity ' + 'success');
                        resolve(params);
                    }else{
                        logger.warn('addCity getCity ' + 'The city has been added!');
                        reject({msg:'已经添加该城市'});
                    }

                }
            })
        });
    }
    const addCity = (cityInfo) =>{
        return new Promise((resolve,reject)=>{
            let pinyin = trans.slugify(cityInfo.cityName);
            cityInfo.cityPinYin = pinyin.replace(new RegExp("-","g"),"");
            cityInfo.cityPY = "";
            let index = pinyin.split("-");
            for (let i =0;i<index.length;i++){
                cityInfo.cityPY += index[i].substr(0,1);
            }
            cityInfoDAO.addCity(cityInfo,(error,result)=>{
                if(error){
                    logger.error(' addCity ' + error.message);
                    reject({err:error.message});
                }else{
                    logger.info(' addCity ' + 'success');
                    resUtil.resetCreateRes(res,result,null);
                    return next();
                }
            })
        });
    }
    getCity()
        .then(addCity)
        .catch((reject)=>{
            if(reject.err){
                resUtil.resInternalError(reject.err,res,next);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
}
const queryCity = (req,res,next) => {
    let params = req.params;
    cityInfoDAO.queryCity(params,(error,result)=>{
        if(error){
            logger.error('queryCity ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('queryCity ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const updateCity = (req,res,next) =>{
    let params = req.params;
    cityInfoDAO.updateCity(params,(error,result)=>{
        if(error){
            logger.error('updateCity ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('updateCity ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

const updateCitySpell = (req,res,next) =>{
    let params = req.params;
    let updateResult = {
        success:0,
        failed : 0
    }
    const getCityList = () =>{
        return new Promise((resolve,reject)=>{
            cityInfoDAO.queryCity(params,(error,rows)=>{
                if(error) {
                    logger.error('updateCitySpell getCityList ' + error.message);
                    reject({err:error});
                }else{
                    if(rows && rows.length > 1) {
                        resolve(rows);
                    }else{
                        logger.warn('updateCitySpell getCityList ' + ' no city info! ');
                        reject({msg:'无城市信息'});
                    }
                }
            })
        });
    }
    const updateCityPY= (cityParams) =>{
        return new Promise((resolve,reject)=>{
            cityInfoDAO.updateCity(cityParams,(error,result)=>{
                if(error){
                    logger.error('updateCitySpell updateCity ' + error.message);
                    reject({err:error});
                }else{
                    logger.info('updateCitySpell updateCity ' + 'success');
                    return resolve(result);
                }
            })
        });
    }
    const updateCiytListPY = (cityArray) =>{
        let subRes = Promise.resolve();
        cityArray.forEach((cityItem,i)=>{
            let pinyin = trans.slugify(cityItem.city_name);
            let cityParams  = {};
            cityParams.cityPinYin = pinyin.replace(new RegExp("-","g"),"");
            cityParams.cityPY = "";
            let index = pinyin.split("-");
            for (let i =0;i<index.length;i++){
                cityParams.cityPY += index[i].substr(0,1);
            }
            cityParams.cityName = cityItem.city_name;
            cityParams.cityId = cityItem.id;
            subRes.then(()=>{
                return updateCityPY(cityParams).then((res)=>{
                    if (res && res.affectedRows > 0) {
                        updateResult.success += 1;
                    } else {
                        updateResult.failed += 1;
                    }
                });
            })
        })
        return new subRes.then(()=>{
            return updateResult
        });
    }
    getCityList()
        .then(updateCiytListPY)
        .then((result) =>{
            resUtil.resetQueryRes(res,updateResult,null);
            return next();
        })
        .catch((reject)=>{
            if(reject.err){
                resUtil.resInternalError(reject.err, res, next);
            }else{
                resUtil.resetFailedRes(res,reject.msg);
            }
        })
}
//暂时不适用queryCityAdmin
const queryCityAdmin = (req,res,next) => {
    let params = req.params;
    cityInfoDAO.queryCityAdmin(params,(error,result)=>{
        if(error){
            logger.error('queryCityAdmin ' + error.message);
            resUtil.resInternalError(error,res,next);
        }else{
            logger.info('queryCityAdmin ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addCity,
    queryCity,
    updateCity,
    updateCitySpell,
    queryCityAdmin
}
