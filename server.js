const path = require('path');
const restify = require('restify');


const sysConfig = require('./config/SystemConfig');
const serverLogger = require('./util/ServerLogger');
const logger = serverLogger.createLogger('Server');


const wechatBl = require('./bl/WechatBl');
const adminUser = require('./bl/AdminUser.js');
const user = require('./bl/User.js');
const city = require('./bl/City.js');
const route = require('./bl/Route.js');
const inquiry = require('./bl/Inquiry.js');
const supplier = require('./bl/Supplier.js');
const supplierBank = require('./bl/SupplierBank.js');
const supplierContact = require('./bl/SupplierContact.js');
const sms = require('./bl/Sms.js');
const inquiryOrder = require('./bl/InquiryOrder.js');
const inquiryCar = require('./bl/InquiryCar.js');
const address = require('./bl/Address.js');
const inquiryBank = require('./bl/InquiryBank.js');
const inquiryInvoice = require('./bl/InquiryInvoice.js');
const payment = require('./bl/Payment.js');
const addressContact = require('./bl/AddressContact.js');
const transAndInsurePrice = require('./bl/TransAndInsurePrice.js');
const orderItem = require('./bl/OrderItem.js');
const userAddress = require('./bl/UserAddress.js');
const refundApply = require('./bl/RefundApply.js');
const orderInvoice = require("./bl/OrderInvoice");
//const email = require('./bl/Email.js');
const statistics = require("./bl/Statistics");
const departmentInfo = require("./bl/DepartmentInfo");
const companyBank = require("./bl/CompanyBank");
const noRouteInquiryInfo = require("./bl/NoRouteInquiryInfo");
const requireTask = require("./bl/RequireTask");
const loadTask = require("./bl/LoadTask");
const loadTaskDetail = require("./bl/LoadTaskDetail");
const recommend = require("./bl/Recommend");
const userDeviceInfo = require("./bl/UserDeviceInfo");
const customerServicePhone = require("./bl/CustomerServicePhone");
const coupon = require('./bl/Coupon');
const userCoupon = require('./bl/UserCoupon');
const commodity = require('./bl/Commodity');
const productOrder = require('./bl/ProductOrder');
const productOrderPayment = require('./bl/ProductOrderPayment');
const reminders = require('./bl/Reminders');
const app = require('./bl/App');

/**
 * Returns a server with all routes defined on it
 */
const createServer=()=>{



    // Create a server with our logger and custom formatter
    // Note that 'version' means all routes will default to
    // 1.0.0
    const server = restify.createServer({

        name: 'LOG-MP-API',
        version: '0.0.1'
    });

    server.pre(restify.pre.sanitizePath());
    server.pre(restify.pre.userAgentConnection());

    server.use(restify.plugins.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));





    server.use(restify.plugins.bodyParser({uploadDir:__dirname+'/../uploads/'}));
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.dateParser());
    server.use(restify.plugins.authorizationParser());
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.gzipResponse());


    restify.CORS.ALLOW_HEADERS.push('auth-token');
    restify.CORS.ALLOW_HEADERS.push('user-name');
    restify.CORS.ALLOW_HEADERS.push('user-type');
    restify.CORS.ALLOW_HEADERS.push('user-id');
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Origin");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Credentials");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","GET");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","POST");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","PUT");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","DELETE");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Headers","accept,api-version, content-length, content-md5,x-requested-with,content-type, date, request-id, response-time");
    server.use(restify.CORS());
    var STATIS_FILE_RE = /\.(css|js|jpe?g|png|gif|less|eot|svg|bmp|tiff|ttf|otf|woff|pdf|ico|json|wav|ogg|mp3?|xml|woff2|map)$/i;
    server.get(STATIS_FILE_RE, restify.serveStatic({ directory: './public/docs', default: 'index.html', maxAge: 0 }));



    server.get(/\.html$/i,restify.serveStatic({
        directory: './public/docs',
        maxAge: 0}));
    server.get(/\.html\?/i,restify.serveStatic({
        directory: './public/docs',
        maxAge: 0}));

    server.get('/',restify.serveStatic({
        directory: './public/docs',
        default: 'index.html',
        maxAge: 0
    }));
    /**
     wechat
     */
    server.get('/api/wechat/:code/openid',wechatBl.getUserIdByCode);
    /**
     inquiry_info
     */
    server.post({path:'/api/user/:userId/inquiry',contentType: 'application/json'},inquiry.addRouteInquiry);
    server.get('/api/user/:userId/inquiry',inquiry.getInquiryByUserId);
    server.get('/api/admin/:adminId/inquiry',inquiry.getInquiryByUserId);
    server.put({path:'/api/admin/:adminId/user/:userId/inquiry/:inquiryId/feePrice',contentType: 'application/json'},inquiry.updateFeePrice);
    server.put({path:'/api/user/:userId/inquiry/:inquiryId/inquiryStatus/:status',contentType: 'application/json'},inquiry.updateInquiryStatus);
    server.put({path:'/api/admin/:adminId/inquiry/:inquiryId/inquiryStatus/:status',contentType: 'application/json'},inquiry.updateInquiryStatus);
    server.put({path:'/api/user/:userId/inquiry/:inquiryId/cancel',contentType: 'application/json'},inquiry.cancelInquiry);
    server.put({path:'/api/admin/:adminId/inquiry/:inquiryId/cancel',contentType: 'application/json'},inquiry.cancelInquiry);
    /**
     user_invoice
     */
    server.post({path:'/api/user/:userId/invoice',contentType: 'application/json'},inquiryInvoice.addInquiryInvoice);
    server.get('/api/user/:userId/invoice',inquiryInvoice.getInquiryInvoice);
    server.del('/api/user/:userId/invoice',inquiryInvoice.deleteUserInvoice);
    server.get('/api/admin/:adminId/invoice',inquiryInvoice.getInquiryInvoice);
    server.put({path:'/api/user/:userId/invoice/:userInvoiceId/defaultInvoice',contentType: 'application/json'},inquiryInvoice.updateInquiryInvoiceStatus);
    server.put({path:'/api/user/:userId/invoice/:userInvoiceId',contentType: 'application/json'},inquiryInvoice.updateUserInvoice);
    /**
     * order_invoice_apply
     */
    server.post({path:'/api/admin/:adminId/order/:orderId/invoiceApply',contentType: 'application/json'},orderInvoice.addByAdmin);
    server.get('/api/admin/:adminId/noInvoiceOrderList',orderInvoice.getNoInvoiceOrderList);
    server.get('/api/admin/:adminId/invoicesList',orderInvoice.getInvoicedOrderList);
    server.put({path:'/api/admin/:adminId/controlInvoices/:invoiceApplyId/Invoiced',contentType: 'application/json'},orderInvoice.updateInvoiceStatus);
    server.put({path:'/api/admin/:adminId/controlInvoices/:invoiceApplyId/replaceOrder/:orderId',contentType: 'application/json'},orderInvoice.replaceOrderId);
    server.put({path:'/api/admin/:adminId/controlInvoices/:invoiceApplyId/updateInvoiceMsg',contentType: 'application/json'},orderInvoice.updateInvoiceApplyMsg);
    server.del({path:'/api/admin/:adminId/controlInvoices/:invoiceApplyId/revokeInvoice',contentType: 'application/json'},orderInvoice.delInvoiceApply);
    server.put({path:'/api/admin/:adminId/controlInvoices/:invoiceApplyId/refuseApply',contentType: 'application/json'},orderInvoice.updateRefuseStatus);
    server.get('/api/user/:userId/noInvoiceOrderList',orderInvoice.getNoInvoiceOrderList);
    server.get('/api/user/:userId/invoicesList',orderInvoice.getInvoicedOrderList);
    server.post({path:'/api/user/:userId/order/:orderId/invoiceApply',contentType: 'application/json'},orderInvoice.addByUser);
    server.del({path:'/api/user/:userId/controlInvoices/:invoiceApplyId/revokeInvoice',contentType: 'application/json'},orderInvoice.delInvoiceApply);
    server.put({path:'/api/user/:userId/controlInvoices/:invoiceApplyId/invoiceMsg',contentType: 'application/json'},orderInvoice.updateInvoiceApplyMsg);
    /**
     inquiry_car
     */
    server.post({path:'/api/user/:userId/inquiry/:inquiryId/inquiryCar',contentType: 'application/json'},inquiryCar.addCar);
    server.get('/api/user/:userId/inquiryCar',inquiryCar.getInquiryCarByInquiryId);
    server.get('/api/admin/:adminId/inquiryCar',inquiryCar.getInquiryCarByInquiryId);
    server.put({path:'/api/user/:userId/inquiryCar/:inquiryCarId/status',contentType: 'application/json'},inquiryCar.updateStatus);
    server.put({path:'/api/user/:userId/inquiryCar/:inquiryCarId/inquiryCarInfo',contentType: 'application/json'},inquiryCar.updateInquiryCar);

    /**
     order_info
     */
    server.post({path:'/api/admin/:adminId/inquiry/:inquiryId/order',contentType: 'application/json'},inquiryOrder.addInquiryOrderByAdmin);
    server.post({path:'/api/admin/:adminId/order',contentType: 'application/json'},inquiryOrder.addOrder);
    server.put({path:'/api/admin/:adminId/order/:orderId/oraPrice',contentType: 'application/json'},inquiryOrder.putInquiryOrder);
    server.put({path:'/api/admin/:adminId/order/:orderId/receiveInfo',contentType: 'application/json'},inquiryOrder.putReceiveInfo);
    server.put({path:'/api/admin/:adminId/order/:orderId/sendInfo',contentType: 'application/json'},inquiryOrder.putSendInfo);
    server.put({path:'/api/admin/:adminId/order/:orderId/totalTransInsurePrice',contentType: 'application/json'},inquiryOrder.putFreightPrice);
    server.put({path:'/api/user/:userId/order/:orderId/status/:status',contentType: 'application/json'},inquiryOrder.putStatus);
    server.put({path:'/api/admin/:adminId/order/:orderId/status/:status',contentType: 'application/json'},inquiryOrder.putStatus);
    server.put({path:'/api/user/:userId/order/:orderId/cancel',contentType: 'application/json'},inquiryOrder.cancelOrder);
    server.put({path:'/api/admin/:adminId/order/:orderId/cancel',contentType: 'application/json'},inquiryOrder.cancelOrder);
    server.get('/api/user/:userId/order',inquiryOrder.getOrderByUser);
    server.get('/api/admin/:adminId/order',inquiryOrder.getOrder);
    server.put({path:'/api/admin/:adminId/order/:orderId/adminMark',contentType: 'application/json'},inquiryOrder.putAdminMark);
    server.put({path:'/api/admin/:adminId/order/:orderId/paymentRemark',contentType: 'application/json'},inquiryOrder.updatePaymentRemark);
    server.put({path:'/api/user/:userId/order/:orderId/remark',contentType: 'application/json'},inquiryOrder.updateById);
    server.put({path:'/api/user/:userId/order/:orderId/sendMsg',contentType: 'application/json'},inquiryOrder.updateById);
    server.put({path:'/api/user/:userId/order/:orderId/recvMsg',contentType: 'application/json'},inquiryOrder.updateById);
    server.put({path:'/api/admin/:adminId/order/:orderId/selfMentionAddress',contentType: 'application/json'},inquiryOrder.selfMentionAddress);
    server.get('/api/admin/:adminId/orderProfit',inquiryOrder.getOrderProfit);
    server.get('/api/admin/:adminId/order/:orderId/orderCostOfCar',inquiryOrder.getOrderCostOfCar);
    server.post({path:'/api/user/:userId/order',contentType: 'application/json'},inquiryOrder.orderWithoutInquiry);
    /**
     order_item
     */
    server.get('/api/user/:userId/orderItem',orderItem.getOrderCar);
    server.get('/api/admin/:adminId/orderItem',orderItem.getOrderCar);
    server.post({path:'/api/user/:userId/order/:orderId/car',contentType: 'application/json'},orderItem.addOrderCar);
    server.post({path:'/api/admin/:adminId/order/:orderId/carAdmin',contentType: 'application/json'},orderItem.addOrderCarAdmin);
    server.del({path:'/api/user/:userId/orderItem/:orderItemId',contentType: 'application/json'},orderItem.delOrderCar);
    server.del({path:'/api/admin/:adminId/orderItem/:orderItemId',contentType: 'application/json'},orderItem.delOrderCar);
    server.put({path:'/api/admin/:adminId/orderItem/:orderItemId/actFeeAndSafePrice',contentType: 'application/json'},orderItem.updateActFee);
    server.put({path:'/api/admin/:adminId/orderItem/:orderItemId/orderItemInfo',contentType: 'application/json'},orderItem.updateOrderItemInfo);
    server.put({path:'/api/user/:userId/orderItem/:orderItemId/updateCarType',contentType: 'application/json'},orderItem.updateCarType);
    /**
     user_bank
     */
    server.post({path:'/api/user/:userId/inquiryBank',contentType: 'application/json'},inquiryBank.addInquiryBank);
    server.get('/api/user/:userId/inquiryBank',inquiryBank.getInquiryBank);
    server.get('/api/admin/:adminId/inquiryBank',inquiryBank.getInquiryBank);
    server.del({path:'/api/user/:userId/inquiryBank/:userBankId',contentType: 'application/json'},inquiryBank.deleteUserBank);
    server.put({path:'/api/user/:userId/inquiryBank/:inquiryBankId/status/:status',contentType: 'application/json'},inquiryBank.updateInquiryBank);
    /**
     user_address
     */
    server.get('/api/admin/:adminId/userAddress',userAddress.getAddress);
    server.get('/api/user/:userId/userAddress',userAddress.getAddress);
    server.post({path:'/api/user/:userId/userAddress',contentType: 'application/json'},userAddress.addAddress);
    server.put({path:'/api/user/:userId/userAddress/:addressId/status',contentType: 'application/json'},userAddress.updateStatus);
    server.put({path:'/api/user/:userId/userAddress/:addressId/address',contentType: 'application/json'},userAddress.updateAddress);
    server.del({path:'/api/user/:userId/userAddress/:addressId',contentType: 'application/json'},userAddress.delAddress);
    /**
     address_info
     */
    server.get('/api/admin/:adminId/address',address.getAddress);
    server.get('/api/user/:userId/address',address.getAddress);
    server.post({path:'/api/user/:userId/address',contentType: 'application/json'},address.addAddress);
    server.post({path:'/api/admin/:adminId/address',contentType: 'application/json'},address.addAddress);
    server.put({path:'/api/user/:userId/address/:addressId/status/:status/',contentType: 'application/json'},address.updateStatus);
    server.put({path:'/api/user/:userId/address/:addressId/addressInfo',contentType: 'application/json'},address.updateAddress);
    server.put({path:'/api/admin/:adminId/address/:addressId/addressByAdmin',contentType: 'application/json'},address.updateAddressByAdmin);
    /**
     address_contact
     */
    server.get('/api/admin/:adminId/addressContact',addressContact.getAddressContact);
    server.get('/api/user/:userId/addressContact',addressContact.getAddressContact);
    server.post({path:'/api/admin/:adminId/addressContact',contentType: 'application/json'},addressContact.addAddressContact);
    server.del({path:'/api/admin/:adminId/addressContact/:addressContactId',contentType: 'application/json'},addressContact.delAddressContact);
    /**
     admin_user
     */
    server.get('/api/adminDevice' ,adminUser.adminDevice);
    server.get('/api/admin' ,adminUser.getAdminUserInfo);
    server.get('/api/admin/:adminId/token/:token' ,adminUser.changeAdminToken);
    server.post({path:'/api/MobileLogin',contentType: 'application/json'},adminUser.adminUserMobileLogin);
    server.post({path:'/api/admin/do/login',contentType: 'application/json'},adminUser.adminUserLogin);
    server.post({path:'/api/admin/:adminId',contentType: 'application/json'},adminUser.addAdminUser);
    server.put({path:'/api/admin/:adminId',contentType: 'application/json'} ,adminUser.updateAdminInfo);
    server.put({path:'/api/admin/:adminId/password',contentType: 'application/json'} ,adminUser.changeAdminPassword);
    server.put({path:'/api/admin/:adminId/status/:status',contentType: 'application/json'} ,adminUser.updateAdminStatus);
    server.put({path:'/api/admin/:adminId/device/:deviceId/appType/:appType/adminDeviceToken',contentType: 'application/json'} ,adminUser.updateUserDeviceToken);


    /**
     user_info
     */
    server.get('/api/user',user.queryUser);
    server.get('/api/admin/:adminId/user',user.queryUser);
    server.post({path:'/api/userLogin',contentType: 'application/json'},user.userLogin);
    server.put({path:'/api/user/:id',contentType: 'application/json'},user.updateUser);
    server.put({path:'/api/user/:id/password',contentType: 'application/json'},user.updatePassword);
    server.put({path:'/api/admin/:adminId/user/:id/wechatStatus/:wechatStatus',contentType: 'application/json'},user.updateStatus);
    server.put({path:'/api/user/:userId/phone/:phone/code/:code',contentType: 'application/json'},user.updatePhone);
    server.put({path:'/api/user/:userId/userInfo',contentType: 'application/json'},user.updateUserInfo);
    server.post({path:'/api/user/:userId/wechatBindPhone',contentType: 'application/json'},user.wechatBindPhone);
    server.get('/api/user/:userId/token/:token',user.updateToken);
    /**
     city_info
     */
    server.post({path:'/api/user/:userId/city',contentType: 'application/json'},city.addCity);
    server.post({path:'/api/admin/:adminId/city',contentType: 'application/json'},city.addCity);
    server.get('/api/user/:userId/city',city.queryCity);
    server.get('/api/admin/:adminId/city',city.queryCity);
    server.put({path:'/api/user/:userId/city/:cityId',contentType: 'application/json'},city.updateCity);
    server.put({path:'/api/admin/:adminId/citySpell',contentType: 'application/json'},city.updateCitySpell);
    /**
     city_route_info
     */
    server.post({path:'/api/user/:userId/route',contentType: 'application/json'},route.addRoute);
    server.get('/api/route',route.queryRoute);
    server.put({path:'/api/user/:userId/route/:routeId',contentType: 'application/json'},route.updateRoute);
    /**
     supplier_info
     */
    server.post({path:'/api/admin/:adminId/supplier',contentType: 'application/json'},supplier.addSupplier);
    server.get('/api/admin/:adminId/supplier',supplier.querySupplier);
    server.put({path:'/api/admin/:adminId/supplier/:supplierId/supplierInfo',contentType: 'application/json'},supplier.updateSupplier);
    server.put({path:'/api/admin/:adminId/supplier/:supplierId/advancedSetting',contentType: 'application/json'},supplier.updateAdvancedSetting);
    server.put({path:'/api/admin/:adminId/supplier/:supplierId/closeFlag/:closeFlag',contentType: 'application/json'},supplier.updateCloseFlag);
    server.get('/api/admin/:adminId/supplierBusiness',supplier.getSupplierBusiness);
    /**
     supplier_bank
     */
    server.post({path:'/api/admin/:adminId/supplier/:supplierId/bank',contentType: 'application/json'},supplierBank.addSupplierBank);
    server.get('/api/admin/:adminId/supplier/:supplierId/bank',supplierBank.querySupplierBank);
    server.del({path:'/api/admin/:adminId/supplier/:supplierId/bank/:bankId',contentType: 'application/json'},supplierBank.delSupplierBank);
    /**
     supplier_contact
     */
    server.post({path:'/api/admin/:adminId/supplier/:supplierId/contact',contentType: 'application/json'},supplierContact.addSupplierContact);
    server.get('/api/admin/:adminId/supplier/:supplierId/contact',supplierContact.querySupplierContact);
    server.del({path:'/api/admin/:adminId/supplier/:supplierId/contact/:contactId',contentType: 'application/json'},supplierContact.delSupplierContact);
    /**
     * payment_info
     */
    server.get('/api/user/:userId/payment' ,payment.getPayment);
    server.get('/api/admin/:adminId/paymentStat' ,payment.getPaymentPrice);
    server.get('/api/admin/:adminId/payment' ,payment.getPayment);
    server.get('/api/admin/:adminId/paymentRefund' ,payment.getRefundByPaymentId);
    server.post({path:'/api/user/:userId/order/:orderId/wechatPayment',contentType: 'application/json'},payment.wechatPayment);
    server.post({path:'/api/wechatPayment',contentType: 'text/xml'},payment.wechatPaymentCallback);
    server.post({path:'/api/admin/:adminId/user/:userId/order/:orderId/wechatRefund',contentType: 'application/json'},payment.wechatRefund);
    server.post({path:'/api/wechatRefund',contentType: 'text/xml'},payment.addWechatRefund);
    server.put({path:'/api/admin/:adminId/payment/:paymentId/paymentRemark',contentType: 'application/json'},payment.updateRemark);
    server.post({path:'/api/user/:userId/order/:orderId/bankPayment',contentType: 'application/json'},payment.addBankPayment);
    server.post({path:'/api/admin/:adminId/order/:orderId/bankPayment',contentType: 'application/json'},payment.addBankPaymentByadmin);
    server.post({path:'/api/admin/:adminId/order/:orderId/payment/:paymentId/bankRefund',contentType: 'application/json'},payment.addBankRefund);
    server.put({path:'/api/admin/:adminId/payment/:paymentId/refundStatus',contentType: 'application/json'},payment.updateBankStatus);
    server.put({path:'/api/user/:userId/payment/:paymentId/RefundRemark',contentType: 'application/json'},payment.updateRefundRemark);
    server.put({path:'/api/admin/:adminId/order/:orderId/bankPayment/:paymentId',contentType: 'application/json'},payment.updatePaymentById);
    server.put({path:'/api/admin/:adminId/payment/:paymentId/paymentReview',contentType: 'application/json'},payment.updateTotalFee);
    server.del({path:'/api/user/:userId/payment/:paymentId',contentType: 'application/json'},payment.deletePayment);
    server.put({path:'/api/user/:userId/payment/:paymentId/bankInfo',contentType: 'application/json'},payment.updateBankInfo);
    /**
     * refund_apply
     */
    server.post({path:'/api/user/:userId/order/:orderId/payment/:paymentId/refundApply',contentType: 'application/json'},refundApply.addRefundApply);
    server.post({path:'/api/admin/:adminId/order/:orderId/payment/:paymentId/refundApply',contentType: 'application/json'},refundApply.addRefundApply);
    server.get('/api/user/:userId/refundApply' ,refundApply.getRefundApply);
    server.get('/api/admin/:adminId/refundApplyStat' ,refundApply.getRefundApplyStat);
    server.put({path:'/api/admin/:adminId/order/:orderId/payment/:paymentId/refundApply/:refundApplyId/refuse',contentType: 'application/json'},refundApply.updateRefuseStatus);
    server.put({path:'/api/admin/:adminId/order/:orderId/payment/:paymentId/refundApply/:refundApplyId/agree',contentType: 'application/json'},refundApply.updateRefundStatus);
    server.put({path:'/api/admin/:adminId/order/:orderId/payment/:paymentId/refundApply/:refundId',contentType: 'application/json'},refundApply.updateRefundById);
    server.del({path:'/api/admin/:adminId/order/:orderId/payment/:paymentId/deleteRefundApply/:refundApplyId',contentType: 'application/json'},refundApply.deleteById);
    server.get('/api/admin/:adminId/refundApply' ,refundApply.getRefundApply);
    server.put({path:'/api/user/:userId/order/:orderId/payment/:paymentId/refundApply/:refundId',contentType: 'application/json'},refundApply.updateRefundById);
    server.del({path:'/api/user/:userId/order/:orderId/payment/:paymentId/refundApply/:refundApplyId',contentType: 'application/json'},refundApply.deleteById);
    server.put({path:'/api/user/:userId/order/:orderId/refundApply/:refundApplyId',contentType: 'application/json'},refundApply.updateRefundApplyMsg);
    /**
     * sendPswdSms
     */
    server.post({path:'/api/user/:userId/phone/:phone/userPhoneSms',contentType: 'application/json'},sms.sendUserSms);
    /**
     * TransAndInsurePrice
     */
    server.post({path:'/api/transAndInsurePrice',contentType: 'application/json'},transAndInsurePrice.transAndInsurePrice);
    /**
     emil
     */
    //server.post({path:'/api/accountConfirmEmail',contentType: 'application/json'},email.sendAccountConfirmEmail);
    //server.get('/api/queryMailRecord',email.queryMailRecord);
    /**
     * Statistics
     */
    server.get('/api/admin/:adminId/statisticsOrderMsgByMonth',statistics.orderMsgByMonths);
    server.get('/api/admin/:adminId/statisticsOrderMsgByDay',statistics.orderMsgByDay);
    server.get('/api/admin/:adminId/statisticsInvoiceMsgByMonth',statistics.invoiceMsgByMonths);
    server.get('/api/admin/:adminId/statisticsInvoiceMsgByDay',statistics.invoiceMsgByDays);
    server.get('/api/admin/:adminId/statisticsRefundPriceByMonth',statistics.paymentRefundPriceByMonths);
    server.get('/api/admin/:adminId/statisticsRefundPriceByDay',statistics.paymentRefundPriceByDays);
    server.get('/api/admin/:adminId/statisticsInquiryCountByMonth',statistics.inquiryCountByMonth);
    server.get('/api/admin/:adminId/statisticsInquiryCountByDay',statistics.inquiryCountByDay);
    server.get('/api/admin/:adminId/statisticsNewUserByMonth',statistics.newUserCountByMonth);
    server.get('/api/admin/:adminId/statisticsNewUserByDay',statistics.newUserCountByDay);
    server.get('/api/admin/:adminId/statisticsPaymentPriceByMonth',statistics.paymentPriceByMonth);
    server.get('/api/admin/:adminId/statisticsPaymentPriceByDay',statistics.paymentPriceByDay);
    server.get('/api/admin/:adminId/paymentInMonth',payment.paymentInMonth);
    server.get('/api/admin/:adminId/refundInMonth',refundApply.refundInMonth);
    server.get('/api/admin/:adminId/price',loadTask.statisticsPrice);
    server.get('/api/admin/:adminId/unInvoice',orderInvoice.statisticsInvoice);
    server.get('/api/admin/:adminId/statisticsOrder',orderInvoice.statisticsOrder);
    server.get('/api/admin/:adminId/unConsultOrderCount',inquiry.getUnConsultOrderCount);
    /**
     * department_info
     */
    server.post({path:'/api/admin/:adminId/department',contentType: 'application/json'},departmentInfo.addDepartmentInfo);
    server.get('/api/admin/:adminId/department',departmentInfo.getDepartmentInfo);
    server.put({path:'/api/admin/:adminId/department/:departmentId',contentType: 'application/json'},departmentInfo.updateDepartmentInfo);
    // server.put({path:'/api/admin/:adminId/department/:departmentId/status/:status',contentType: 'application/json'},departmentInfo.updateDepartmentInfo);

    /**
     * company_bank
     */
    server.post({path:'/api/admin/:adminId/companyBank',contentType: 'application/json'},companyBank.addCompanyBank);
    server.get('/api/companyBank',companyBank.getCompanyBank);
    server.put({path:'/api/admin/:adminId/companyBank/:companyBankId',contentType: 'application/json'},companyBank.updateCompanyBank);
    server.put({path:'/api/admin/:adminId/companyBank/:companyBankId/status/:status',contentType: 'application/json'},companyBank.updateCompanyBank);

    /**
     * noRoute_inquiry_info
     */
    server.post({path:'/api/user/:userId/noRouteInquiryInfo',contentType: 'application/json'},noRouteInquiryInfo.addNoRouteInquiry);
    /**
     * require_task
     */
    server.post({path:'/api/admin/:adminId/order/:orderId/requireTask',contentType: 'application/json'},requireTask.addRequireTask);
    server.get('/api/admin/:adminId/requireTask',requireTask.getRequireOrder);
    server.put({path:'/api/admin/:adminId/requireTask/:requireId/status/:status',contentType: 'application/json'},requireTask.updateStatus);
    /**
     * dp_load_task
     */
    server.post({path:'/api/admin/:adminId/order/:orderId/require/:requireId/loadTask',contentType: 'application/json'},loadTask.addLoadTask);
    server.post({path:'/api/admin/:adminId/loadTask/:loadTaskId/supplier',contentType: 'application/json'},loadTask.submitToSupplier);
    server.get('/api/admin/:adminId/order/:orderId/require/:requireId/loadTask',loadTask.getOrderLoadTask);
    server.del({path:'/api/admin/:adminId/loadTask/:loadTaskId',contentType: 'application/json'},loadTask.delLoadTask);
    server.put({path:'/api/admin/:adminId/loadTask/:loadTaskId',contentType: 'application/json'},loadTask.updateLoadTask);
    server.put({path:'/api/admin/:adminId/loadTask/:loadTaskId/status/:status',contentType: 'application/json'},loadTask.updateLoadTaskStatus);
    server.get('/api/admin/:adminId/loadTask/:loadTaskId/syncLoadTask',loadTask.getSyncLoadTask);
    server.get('/api/admin/:adminId/loadTaskProfitOfCar',loadTask.getLoadTaskProfitOfCar);
    server.put({path:'/api/admin/:adminId/loadTask/:loadTaskId/syncComplete',contentType: 'application/json'},loadTask.syncComplete);
    server.get('/api/admin/:adminId/routeLoadTask',loadTask.getRouteLoadTask);
    server.put({path:'/api/admin/:adminId/loadTask/:loadTaskId/payment',contentType: 'application/json'},loadTask.doPayment);
    server.get('/api/admin/:adminId/orderItem/:orderItemId/loadTask',loadTask.getRouteOfCar);
    /**
     * dp_load_task_detail
     */
    server.post({path:'/api/admin/:adminId/loadTask/:loadTaskId/loadTaskDetail',contentType: 'application/json'},loadTaskDetail.addLoadTaskDetail);
    server.get('/api/admin/:adminId/order/:orderId/loadTask/:loadTaskId/loadTaskDetail',loadTaskDetail.getArrangeLoadTaskDetail);
    server.put({path:'/api/admin/:adminId/loadTask/:loadTaskId/loadTaskDetail/:loadTaskDetailId',contentType: 'application/json'},loadTaskDetail.updateLoadTaskDetail);
    server.del({path:'/api/admin/:adminId/loadTask/:loadTaskId/loadTaskDetail/:loadTaskDetailId',contentType: 'application/json'},loadTaskDetail.deleteLoadTaskDetail);
    server.get('/api/admin/:adminId/loadTask/:loadTaskId/syncLoadTaskDetail/:syncLoadTaskId',loadTaskDetail.getLoadTaskDetail);

    /**
     * recommend_info
     */
    server.post({path:'/api/admin/:adminId/recommend',contentType: 'application/json'},recommend.addRecommend);
    server.get('/api/admin/:adminId/recommend',recommend.getRecommend);
    server.put({path:'/api/admin/:adminId/recommend/:recommendId',contentType: 'application/json'},recommend.updateRecommend);
    server.put({path:'/api/admin/:adminId/recommend/:recommendId/advertisement',contentType: 'application/json'},recommend.addAdvertisement);
    server.post({path:'/api/recommend/:recommendId/wxCodeImage',contentType: 'application/json'},recommend.postWxCodeImage);
    server.get('/api/admin/:adminId/achievement',recommend.getAchievement);
    /**
     * user_device_info
     */
    server.post({path:'/api/user/:userId/device',contentType: 'application/json'},userDeviceInfo.addUserDeviceInfo);
    /**
     * customer_service_phone
     */
    server.post({path:'/api/admin/:adminId/customerPhone',contentType: 'application/json'},customerServicePhone.addCustomerPhone);
    server.get('/api/admin/:adminId/customerPhone',customerServicePhone.getCustomerPhone);
    server.del({path:'/api/admin/:adminId/customerPhone',contentType: 'application/json'},customerServicePhone.deleteCustomerPhone);
    server.put({path:'/api/admin/:adminId/customerPhone/:id',contentType: 'application/json'},customerServicePhone.updateCustomerPhone);
    server.get('/api/user/:userId/customerPhone',customerServicePhone.getCustomerPhone);
    /**
     * coupon
     */
    server.get('/api/admin/:adminId/coupon/:couponId/count',coupon.getCouponCount);
    server.get('/api/admin/:adminId/coupon',coupon.getCoupon);
    server.post({path:'/api/admin/:adminId/coupon',contentType: 'application/json'},coupon.addCoupon);
    server.put({path:'/api/admin/:adminId/coupon/:couponId',contentType: 'application/json'},coupon.updateCoupon);
    server.put({path:'/api/admin/:adminId/coupon/:couponId/status/:status',contentType: 'application/json'},coupon.updateStatus);
    server.del({path:'/api/admin/:adminId/coupon/:couponId/showStatus',contentType: 'application/json'},coupon.deleteCoupon);
    /**
     * user_coupon
     */
    server.get('/api/admin/:adminId/userCoupon',userCoupon.getUserCoupon);
    server.post({path:'/api/admin/:adminId/user/:userId/userCoupon',contentType: 'application/json'},userCoupon.addUserCoupon);
    /**
     * commodity
     */
    server.get('/api/commodity/:commodityId/view',commodity.getCommodityPage);
    server.get('/api/user/:userId/commodity',commodity.getCommodity);
    server.get('/api/admin/:adminId/commodity',commodity.getCommodity);
    server.post({path:'/api/admin/:adminId/commodity',contentType: 'application/json'},commodity.addCommodity);
    server.put({path:'/api/admin/:adminId/commodity/:commodityId/image',contentType: 'application/json'},commodity.updateImage);
    server.put({path:'/api/admin/:adminId/commodity/:commodityId/info',contentType: 'application/json'},commodity.updateInfo);
    server.put({path:'/api/admin/:adminId/commodity/:commodityId/commodityInfo',contentType: 'application/json'},commodity.updateCommodity);
    server.put({path:'/api/admin/:adminId/commodity/:commodityId/status/:status',contentType: 'application/json'},commodity.updateStatus);
    server.put({path:'/api/admin/:adminId/commodity/:commodityId/showStatus/:showStatus',contentType: 'application/json'},commodity.updateShowStatus);
    /**
     * product_order_info
     */
    server.get('/api/user/:userId/productOrder',productOrder.getUserProductOrder);
    server.post({path:'/api/user/:userId/productOrder',contentType: 'application/json'},productOrder.addUserProductOrder);
    server.get('/api/admin/:adminId/productOrder',productOrder.getProductOrder);
    server.put({path:'/api/admin/:adminId/productOrder/:productOrderId/remark',contentType: 'application/json'},productOrder.updateRemark);
    server.put({path:'/api/admin/:adminId/productOrder/:productOrderId/status/:status',contentType: 'application/json'},productOrder.updateStatus);
    /**
     * product_order_payment
     */
    server.post({path:'/api/user/:userId/productOrder/:productOrderId/wechatPayment',contentType: 'application/json'},productOrderPayment.wechatPayment);

    /**
     * reminders
     */
    server.post({path:'/api/user/:userId/commodity/:commodityId/reminders',contentType: 'application/json'},reminders.addReminders);
    server.get('/api/admin/:adminId/reminders',reminders.getReminders);
    server.put({path:'/api/admin/:adminId/reminders/:reminderId/',contentType: 'application/json'},reminders.updateReminders);

    /**
     * app
     */
    server.get('/api/app',app.getApp);
    server.post({path:'/api/admin/:adminId/app',contentType: 'application/json'},app.addApp);
    server.put({path:'/api/admin/:adminId/app/:appId',contentType: 'application/json'},app.updateApp);

    server.on('NotFound', function (req, res ,next) {
        logger.warn(req.url + " not found");
        res.send(404,{success:false,msg:" service not found !"});
        next();
    });
    return (server);

}



///--- Exports

module.exports = {
    createServer
};