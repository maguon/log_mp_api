'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('LoadTaskDetailDAO.js');
const db = require('../db/connection/MysqlDb.js');

const add = (params,callback) => {
    let query = "insert into dp_load_task_detail (dp_load_task_id,require_id,order_id,order_item_id,supplier_id,vin,date_id,supplier_trans_price,supplier_insure_price)";
    query += " values (?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.loadTaskId;
    paramsArray[i++] = params.requireId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.orderItemId;
    paramsArray[i++] = params.supplierId;
    paramsArray[i++] = params.vin;
    paramsArray[i++] = params.dateId;
    paramsArray[i++] = params.supplierTransPrice;
    paramsArray[i] = params.supplierInsurePrice;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addLoadTaskDetail');
        callback(error,rows);
    })
}

module.exports={
    add
}