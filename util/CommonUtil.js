'use strict'
const sysConsts = require("../util/SystemConst")

const calculatedAmount = (serviceType,oldCar,modelType,distance,safeStatus,valuation) => {
    let servicePrice = 0;
    let oldCarRatio = 0;
    let modelRatio = 0;
    let transPrice = 0;
    let insurePrice = 0;

    if(safeStatus == sysConsts.CAR.insureFlag.yes){
        insurePrice = valuation * sysConsts.CALCULATED_AMOUNT.insureRatio;
    }
    if(serviceType == sysConsts.ORDER.serviceType.doorToDoor){//服务费上门服务500
        servicePrice = sysConsts.CALCULATED_AMOUNT.servicePrice;
    }
    if(oldCar == sysConsts.CAR.oldFlag.yes){//二手车估值0.8
        oldCarRatio = sysConsts.CALCULATED_AMOUNT.oldCarRatio;
    }else if (oldCar == sysConsts.CAR.oldFlag.no){
        oldCarRatio = sysConsts.CALCULATED_AMOUNT.notOldCarRatio;
    }
    switch (modelType) {
        case sysConsts.CAR_MODEL.NormalCar.type:
            modelRatio = sysConsts.CAR_MODEL.NormalCar.ratio;break;
        case sysConsts.CAR_MODEL.NormalSUV.type:
            modelRatio = sysConsts.CAR_MODEL.NormalSUV.ratio;break;
        case sysConsts.CAR_MODEL.LargeSUV.type:
            modelRatio = sysConsts.CAR_MODEL.LargeSUV.ratio;break;
        case sysConsts.CAR_MODEL.normalBPV.type:
            modelRatio = sysConsts.CAR_MODEL.normalBPV.ratio;break;
        case sysConsts.CAR_MODEL.LargeBPV.type:
            modelRatio = sysConsts.CAR_MODEL.LargeBPV.ratio;break;
    }

    transPrice = servicePrice + sysConsts.CALCULATED_AMOUNT.kmUnitPrice * distance * modelRatio * oldCarRatio; //公里单价1.2元

    let priceItem = {
        trans: transPrice,
        insure: insurePrice
    }
    return priceItem;
}

module.exports={
    calculatedAmount
}