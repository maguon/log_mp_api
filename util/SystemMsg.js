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

/**
 * The module for admin
 */
let ADMIN_LOGIN_USER_UNREGISTERED = "用户不存在"; //Customer use a email that not exist in system to login.

/**
 * The payment for admin
 */
let ADMIN_PAYMENT_UPDATE_PERMISSION = "只有银行转账才能修改金额";

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
    ADMIN_PAYMENT_UPDATE_PERMISSION
}