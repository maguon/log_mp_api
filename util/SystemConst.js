'use strict';
const CAR_MODEL ={
    NormalCar:{//标准轿车
       type:1,
        ratio:0.9
    },
    NormalSUV:{//标准suv
        type:2,
        ratio:1.0
    },
    LargeSUV:{//大型suv
        type:3,
        ratio:1.1
    },
    normalBPV:{//标准商务车
        type:4,
        ratio:1.0
    },
    LargeBPV:{//大型商务车
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
        extrnal :2,//外部订单
        owner :3//自建订单
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
    },
    budgetStatus:{
        profit:1,//盈利
        loss:2//亏损
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
        inquirying:0,//询价中
        enquiryPrice:1,//已询价
        getOrder:2,//生成订单
        cancelOrder:3//取消订单
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
        arranged:1,//已安排
        complete:9//已完成
    }
}
const SUPPLIER={
    closeFlag:{
        close:1,
        open:0
    }
}
const LOAD_TASK_STATUS ={
    //1-未装车,2-已装车,3-已送达
    noLoad:1,
    loading:2,
    served:3
}
const LOAD_TASK_PAYMENTFLAG ={
    yes:1,//已付款
    no:0//未付款
}
const CALCULATED_AMOUNT = {
    insureRatio:0.05,//保费
    servicePrice:500,//服务费上门服务500
    oldCarRatio:0.8,//二手车估值0.8
    notOldCarRatio:0.1,//非二手车估值0.1
    kmUnitPrice:1.2//公里单价1.2元
}
const ADMIN_INFO ={
    Status:{
        disable:0,//停用
        available:1//可用
    }
}
const PRODUCT_ORDER ={
    type:{
        whole :1,//全款购车
        earnestMoney :2,//定金购车
        arrivalOfGoods :3//货到付款
    },
    payment_status:{
        unPaid:1,//未支付
        partial:2,//部分支付
        complete:3,//支付完成
        refund:4,//支付完成
    },
    status:{
        tpShipped:1,//待发货
        shipped:2,//已发货
        served:3,//已送达
        completed:4,//已完成
        cancelled:5,//已取消
    },
}
const REMINDERS_INFO ={
    status:{
        no_contact:0,//未联系
        contacted:1//已联系
    }
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
    SUPPLIER,
    LOAD_TASK_STATUS,
    LOAD_TASK_PAYMENTFLAG,
    CALCULATED_AMOUNT,
    ADMIN_INFO,
    REMINDERS_INFO,
    PRODUCT_ORDER
}