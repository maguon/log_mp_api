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
const ORDER ={
    type :{
        internal :1,//内部订单
        extrnal :2//外部订单
    },
    serviceType:{
        doorToDoor :1,//上门提货
        selfMention :2//自提
    },
    paymentStatus:{
        complete:2,//支付完成
        unPaid:0,//未支付
        partial:1//部分支付
    },
    status:{
        informationToBeImproved :0,//待完善信息
        priceToBeImproved:1,//待完善价格
        reqToBeGenerated:2,//待生成需求
        carsToBeArranged:3,//待安排车辆
        inExecution:4,//执行中
        cancelled:8,//已取消
        completed:9//已完成
    },
    logStatus:{
        toArrange:0,//待安排0
        tpShipped:1,//待发运1
        inTransport:2,//运输中2
        served:3//已送达3
    }
}
const REFUND_STATUS = {
    refuse:0,//已拒绝
    refunded:1,//已退款
    applying:2//申请中
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
const ORDER_INVOICE_APPLY = {
    status:{
        apply: 0,
        invoiced:1,
        refuse:2
    }
}
const INQUIRY = {
    status:{
        inquirying:0,
        enquiryPrice:1,
        getOrder:2,
        cancelOrder:3
    }
}
const CAR = {
    oldFlag:{
        yes:0,
        no:1
    },
    insureFlag:{
        yes:1,
        no:0
    },
    inquiryStatus:{
        showInUser:1,
        unShowInUser:0
    }
}
const USER_INVOICE = {
    status :{
        default:1,//默认发票
        normal:0
    }
}
const NOROUTE_INQUIRY ={
    status:{
        noRoute:0,
        hasRoute:1
    }
}
const SUPER_ADMIN_TYPE = 99;
const REQUIRE_TASK = {
    status:{
        toArrange:0,//待安排
        inArrange:1,//安排中
        arranged:2//已安排
    }
}
const SUPPLIER_URL={
    host:"stg.myxxjs.com",
    port:9001
}
module.exports = {
    CAR_MODEL,
    PAYMENT,
    REFUND_STATUS,
    ORDER,
    USER_ADDRESS,
    ORDER_INVOICE_APPLY,
    INQUIRY,
    CAR,
    USER_INVOICE,
    NOROUTE_INQUIRY,
    SUPER_ADMIN_TYPE,
    REQUIRE_TASK,
    SUPPLIER_URL
}