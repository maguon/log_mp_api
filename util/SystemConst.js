'use strict';
const CAR_MODEL ={
    NormalCar:{
        type:1,
        ratio:0.9
    },
    NormalSUV:{
        type:2,
        ratio:1.0
    },
    LargeSUV:{
        type:3,
        ratio:1.1
    },
    normalBPV:{
        type:4,
        ratio:1.0
    },
    LargeBPV:{
        type:5,
        ratio:1.01
    }
}

const PAYMENT = {
    paymentType:{
        wechat:1,
        bankTransfer:2
    },
    type:{
        payment:1,
        refund:0
    },
    status:{
        unPaid:0,
        paid:1
    }
}

const ORDER_TYPE ={
    internal :1,
    extrnal :2
}
const ORDER_SERVICE_TYPE ={
    doorToDoor :1,
    selfMention :2
}
const REFUND_STATUS = {
    refuse:0,
    refunded:1,
    applying:2
}
const USER_ADDRESS ={
    type:{
        departure:1,
        parking:0
    },
    status:{
        disabled:0,//停用地址
        enable:1//启用地址
    }
}

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
    if(params.insuranceFlag == 1 || params.safeStatus == 1){
        insurePrice = params.valuation * 0.05;
    }
    let priceItem = [{
        trans: transPrice,
        insure: insurePrice
    }]
    callback(priceItem);
}
module.exports = {
    transAndInsurePrice,
    CAR_MODEL,
    PAYMENT,
    REFUND_STATUS,
    ORDER_TYPE,
    ORDER_SERVICE_TYPE,
    USER_ADDRESS
}