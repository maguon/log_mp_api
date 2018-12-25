'use strict';

const transAndInsurePrice = (params,callback) => {
    let servicePrice = 0;
    let oldCarRatio = 0;
    let modelRatio = 0;
    let transPrice = 0;
    let insurePrice = 0;
    if(params.serviceType && params.serviceType === 1){
        servicePrice = 500;
    }
    if(params.oldCar == 0){
        oldCarRatio = 0.8;
    }
    if(params.oldCar && params.oldCar == 1){
        oldCarRatio = 1.0;
    }
    if(params.modelType && params.modelType == 1){
        modelRatio = 0.9;
    }
    if(params.modelType && params.modelType == 2){
        modelRatio = 1.0;
    }
    if(params.modelType && params.modelType == 3){
        modelRatio = 1.1;
    }
    if(params.modelType && params.modelType == 4){
        modelRatio = 1.0;
    }
    if(params.modelType && params.modelType == 5){
        modelRatio = 1.1;
    }
    transPrice = servicePrice + 1.2 * params.distance * modelRatio * oldCarRatio;
    if(params.insuranceFlag == 1){
        insurePrice = params.valuation * 0.05;
    }
    let priceItem = [{
        trans: transPrice,
        insure: insurePrice
    }]
    callback(priceItem);
}
module.exports = {
    transAndInsurePrice
}