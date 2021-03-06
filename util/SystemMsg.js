/**
 * The module of system basic module
 * @type {string}
 */
'use strict';
let SYS_AUTH_TOKEN_ERROR ="当前用户级别，不能完成此操作" ; //The token info in request headers is error,can't access api.
let SYS_VALIDATE_EMAIL_ERROR = "The email is not correct"; // The email will be used format is not correct.
let SYS_VALIDATE_EMAIL_DUPLICATE = "该邮箱已经被使用"; // The email will be used format is not correct.
let SYS_INTERNAL_ERROR_MSG = "Web Service Internal Error . ";
let SYS_PARAMETERS_ERROR_MSG = "Parameters is error . ";
let SYS_TABLE_DUPLICATE_ERROR_MSG = "Duplicate parameter !";
let SYS_TAX_DUPLICATE_ERROR_MSG = "Duplicate parameter !";
let SYS_MESSAGE_QUEUE_ERROR_MSG = "Message queue is down !";
/**
 * The module of customer
 * @type {string}
 */
let CUST_SIGNUP_REGISTERED = "已被注册";//Cutomer do signup ,but the current phone has been exist in system.
let CUST_SIGNUP_REGISTERED_EN = "The user has been exist in system .";//Cutomer do signup ,but the current phone has been exist in system.
let CUST_LOGIN_USER_UNREGISTERED = "尚未注册"; //Customer use a email that not exist in system to login
let CUST_SMS_CAPTCHA_ERROR = "短信验证码错误";
let CUST_LOGIN_PSWD_ERROR = "登录密码错误" ; // Customer enter a wrong password on login
let CUST_ORIGIN_PSWD_ERROR = "原始密码错误" ; //Customer need enter origin password before change new login password
let CUST_ACTIVE_DATA_ERROR = "The active url is not valid"; //The active data is wrong in active url.
let CUST_ACTIVE_DUPLICATE_ERROR = "The user has been actived" // User do active when user state is active.
let CUST_ACTIVE_STATE_ERROR = "The user is not actived" // User do active when user state is active.
let CUST_FORBIDDEN_STATE_ERROR = "The user is forbidden" // User status is forbidden.
let CUST_CHANGE_EMAIL_DATA_ERROR = "The change email url is not valid" // User do active when user state is active.
let CUST_CREATE_EXISTING = "已经存在";
let CUST_WECHAT_CHECK_IDENTITY = "用户身份校验失败";

/**
 * The module for admin
 */
let ADMIN_LOGIN_USER_UNREGISTERED = "用户不存在"; //Customer use a email that not exist in system to login.
let ADMIN_UNREGISTERED = "操作员不存在";
/**
 * The module for user
 */
let USER_UNREGISTERED = "用户不存在";
/**
 * The payment for admin
 */
let ADMIN_PAYMENT_UPDATE_PERMISSION = "只有银行转账才能操作";
let ADMIN_PAYMENT_NO_MSG = "找不到该支付信息";
let ADMIN_PAYMENT_REFUND_PRICE = "退款金额不得大于支付金额";
/**
 * The order invoice apply
 */
let ADMIN_ORDER_INVOICE_APPLY_REVOKE = "已经处理的发票不能被撤销呦";
let ADMIN_ORDER_UNREGISTERED = "该订单不存在,请输入正确的订单编号";
let ADMIN_ORDER_INVOICE_ONLYONE = "一个订单只能申请一张发票";
let ORDER_PAYMENT_STATUS_COMPLETE = "完成支付的订单无需再支付";
/**
 * The inquiry info
 */
let USER_GET_NO_INQUIRY = "找不到该询价信息,请输入正确的询价码";
let GET_TRANS_AND_INSURE_PRICE = "未算出单价";

/**
 * The admin of user
 */
let ADMIN_SUPER_USER_CREATE = "该用户没有权限创建管理员";
let ADMIN_NO_USER = "该用户不存在";
/**
 * The supplier info
 */
let SUPPLIER_NOT_EXISTS ="该供应商不存在";
let SUPPLIER_CLOSE_NOTALLOW_SYNC ="关闭高级设置不允许同步到供应商";
let SUPPLIER_NO_APP_MSG ="完成同步的路线中需设置供应商信息即可删除";
/**
 * order info
 */
let ADMIN_ADD_REQUIRE_ORDER_STATUS = "该订单已经是待安排车辆订单";
let ORDER_NO_EXISTE = "该订单不存在";
let ORDER_SERVICETYPE_SELFMENTION_UPDATE_ADDRESS = "只有当地自提的订单才能更新自提点地址";
let ORDER_ITEM_NO_EXISTS = "该车辆信息不存在";
/**
 *The require Task
 */
let REQUIRE_NO_EXISTE = "该需求不存在";
/**
 * The dp_Load_task
 */
let LOAD_TASK_NO_EXISTS = "运输路线不存在";
let LOAD_TASK_INCOMPLETE = "运输任務未完成！";
let LOADTASK_DETAIL_SUPPLIERPRICE_ZERO = "运输费用不能为空";
let LOADTASK_DETAIL_SUPPLIERPRICE_INTEGER = "运输费用不能小于0";
let LOADTASK_ADD_NULL = "运输线路需求创建失败";
let LOCKDETAIL_DELETE_ALREADY_SYNC ="已经同步的车辆无法单独取消";
let LOCKTASK_DELETE_ALREADY_SYNC = "已经同步的路线无法取消";
let LOADTASK_DO_FAIL = "运输线路操作失败";
let LOCKTASK_UPDATE_ALREADY_SYNC = "已经同步的路线无法修改";
let LOADTASK_DETAIL_NO_EXISTE = "该运输车辆不存在";
let LOADTASK_NO_HOOKID = "该运输详细没有同步，请先同步";
let LOADTASK_DETAIL_SYNC_NULL = "没有需要同步的车辆，无法同步";
/**
 * recommend_info
 */
let RECOMMEND_TASK_NO_EXISTS = "推荐信息不存在";
/**
 * coupon
 */
let COUPON_NO_EXISTS = "该优惠卷信息不存在！";
let COUPON_NOT_MODIFIED = "该优惠卷不允许修改！";
let COUPON_NOT_DELETE = "该优惠卷不允许删除！";
/**
 * city
 */
let CITY_ID_ERROR = "城市信息不存在！";
let CITY_HAS_BEEN_ADDED = "该城市已添加！";
/**
 * commodity
 */
let COMMODITY_ID_ERROR = "商品信息不存在！";
let COMMODITY_INSUFFICIENT_QUANTITY = "商品数量不足！";
/**
 * reminders
 */
let REMINDERS_ID_ERROR = "不存在该提醒！";
let REMINDERS_STATUS_NO_MODIFY = "已提醒，不允许重复提醒！";
/**
 * productOrder
 */
let PRODUCT_ORDER_ID_ERROR = "没有此订单信息！";
let PRODUCT_ORDER_STATUS_ERROR = "此订单状态不存在！";
let PRODUCT_ORDER_TYPE_ERROR = "商品购付方式不同，请分开下单！";
/**
 * productOrderPayment
 */
let PRODUCT_PAYMENT_ID_ERROR = "没有此支付信息！";
/**
 * poster
 */
let POSTER_ID_ERROR = "没有此推广信息！";
module.exports = {
    SYS_AUTH_TOKEN_ERROR,
    SYS_VALIDATE_EMAIL_ERROR,
    SYS_INTERNAL_ERROR_MSG,
    SYS_PARAMETERS_ERROR_MSG,
    SYS_VALIDATE_EMAIL_DUPLICATE,
    SYS_TABLE_DUPLICATE_ERROR_MSG,
    SYS_TAX_DUPLICATE_ERROR_MSG,
    SYS_MESSAGE_QUEUE_ERROR_MSG,
    CUST_SIGNUP_REGISTERED,
    CUST_SIGNUP_REGISTERED_EN,
    CUST_LOGIN_USER_UNREGISTERED,
    CUST_SMS_CAPTCHA_ERROR,
    CUST_LOGIN_PSWD_ERROR,
    CUST_ORIGIN_PSWD_ERROR,
    CUST_ACTIVE_DATA_ERROR,
    CUST_ACTIVE_DUPLICATE_ERROR,
    CUST_ACTIVE_STATE_ERROR,
    CUST_FORBIDDEN_STATE_ERROR,
    CUST_CHANGE_EMAIL_DATA_ERROR,
    CUST_CREATE_EXISTING,
    ADMIN_LOGIN_USER_UNREGISTERED,
    ADMIN_UNREGISTERED,

    USER_UNREGISTERED,

    ADMIN_PAYMENT_UPDATE_PERMISSION,
    ADMIN_PAYMENT_NO_MSG,
    ADMIN_ORDER_INVOICE_APPLY_REVOKE,
    ADMIN_ORDER_UNREGISTERED,
    ADMIN_ORDER_INVOICE_ONLYONE,
    USER_GET_NO_INQUIRY,
    GET_TRANS_AND_INSURE_PRICE,
    ORDER_PAYMENT_STATUS_COMPLETE,
    ADMIN_PAYMENT_REFUND_PRICE,
    CUST_WECHAT_CHECK_IDENTITY,
    ADMIN_SUPER_USER_CREATE,
    ADMIN_NO_USER,
    SUPPLIER_NOT_EXISTS,
    ADMIN_ADD_REQUIRE_ORDER_STATUS,
    ORDER_NO_EXISTE,
    REQUIRE_NO_EXISTE,
    LOAD_TASK_NO_EXISTS,
    LOAD_TASK_INCOMPLETE,
    ORDER_SERVICETYPE_SELFMENTION_UPDATE_ADDRESS,
    LOADTASK_DETAIL_SUPPLIERPRICE_ZERO,
    LOADTASK_ADD_NULL,
    SUPPLIER_CLOSE_NOTALLOW_SYNC,
    LOCKDETAIL_DELETE_ALREADY_SYNC,
    ORDER_ITEM_NO_EXISTS,
    LOCKTASK_DELETE_ALREADY_SYNC,
    LOADTASK_DO_FAIL,
    LOCKTASK_UPDATE_ALREADY_SYNC,
    LOADTASK_DETAIL_NO_EXISTE,
    LOADTASK_DETAIL_SUPPLIERPRICE_INTEGER,
    LOADTASK_NO_HOOKID,
    LOADTASK_DETAIL_SYNC_NULL,
    SUPPLIER_NO_APP_MSG,
    RECOMMEND_TASK_NO_EXISTS,
    COUPON_NO_EXISTS,
    COUPON_NOT_MODIFIED,
    COUPON_NOT_DELETE,
    CITY_ID_ERROR,
    CITY_HAS_BEEN_ADDED,
    COMMODITY_ID_ERROR,
    COMMODITY_INSUFFICIENT_QUANTITY,
    REMINDERS_ID_ERROR,
    REMINDERS_STATUS_NO_MODIFY,
    PRODUCT_ORDER_ID_ERROR,
    PRODUCT_ORDER_STATUS_ERROR,
    PRODUCT_ORDER_TYPE_ERROR,

    PRODUCT_PAYMENT_ID_ERROR,

    POSTER_ID_ERROR
}