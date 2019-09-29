'use strict';
let serverLogger = require('../util/ServerLogger.js');
let httpUtil = require('../util/HttpUtil.js');

const saveLoadTaskToSupplier = (params,callback)=>{
    httpUtil.httpPost(params.appUrl,'/api/entrust/'+params.appId+"/dpDemand",params.req,params.options,(error,result)=>{
        callback(error,result)
    })
}
const saveLoadTaskDetailToSupplier = (params,callback)=>{
    httpUtil.httpPost(params.appUrl,'/api/user/'+0+"/entrustCar",params.req,params.options,(error,result)=>{
        callback(error,result)
    })
}
const putLoadTaskStatusToSupplier = (params,callback)=>{
    httpUtil.httpPut(params.appUrl,'/api/entrust/'+params.entrustId+"/dpDemand/"+params.dpDemandId+"/demandStatus/"+params.demandStatus,params.req,{},(error,result)=>{
        callback(error,result)
    })
}
const getRouteLoadTask= (params,callback)=>{
    httpUtil.httpGet(params.appUrl,'/api/dpRouteLoadTask',params,params.options,(error,result)=>{
        callback(error,result)
    })
}
const getRouteLoadTaskDetail= (params,callback)=>{
    httpUtil.httpGet(params.appUrl,'/api/dpRouteLoadTask/'+params.dpRouteLoadTaskId+"/dpRouteLoadTaskDetail",params,params,(error,result)=>{
        callback(error,result)
    })
}
const getDpDemand= (params,callback)=>{
    httpUtil.httpGet(params.appUrl,'/api/entrust/'+params.entrustId+"/dpDemand",params.options,params.options,(error,result)=>{
        callback(error,result)
    })
}

module.exports={
    saveLoadTaskToSupplier,
    saveLoadTaskDetailToSupplier,
    putLoadTaskStatusToSupplier,
    getRouteLoadTask,
    getRouteLoadTaskDetail,
    getDpDemand
}