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
//const email = require('./bl/Email.js');


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
    server.get('/api/admin/:adminId/invoice',inquiryInvoice.getInquiryInvoice);
    server.put({path:'/api/user/:userId/invoice/:invoiceId/status/:status',contentType: 'application/json'},inquiryInvoice.updateInquiryInvoiceStatus);
    /**
     inquiry_car
     */
    server.post({path:'/api/user/:userId/inquiry/:inquiryId/inquiryCar',contentType: 'application/json'},inquiryCar.addCar);
    server.get('/api/user/:userId/inquiryCar',inquiryCar.getInquiryCarByInquiryId);
    server.get('/api/admin/:adminId/inquiryCar',inquiryCar.getInquiryCarByInquiryId);
    server.put({path:'/api/user/:userId/inquiryCar/:inquiryCarId/status/:status',contentType: 'application/json'},inquiryCar.updateStatus);
    server.put({path:'/api/user/:userId/inquiryCar/:inquiryCarId/inquiryCarInfo',contentType: 'application/json'},inquiryCar.updateInquiryCar);

    /**
     user_order
     */
    server.post({path:'/api/user/:userId/inquiry/:inquiryId/order',contentType: 'application/json'},inquiryOrder.addInquiryOrderByUser);
    server.post({path:'/api/admin/:adminId/inquiry/:inquiryId/order',contentType: 'application/json'},inquiryOrder.addInquiryOrderByAdmin);
    server.post({path:'/api/admin/:adminId/order',contentType: 'application/json'},inquiryOrder.addOrder);
    server.put({path:'/api/admin/:adminId/order/:orderId/oraPrice',contentType: 'application/json'},inquiryOrder.putInquiryOrder);
    server.put({path:'/api/user/:userId/order/:orderId/receiveInfo',contentType: 'application/json'},inquiryOrder.putReceiveInfo);
    server.put({path:'/api/user/:userId/order/:orderId/sendInfo',contentType: 'application/json'},inquiryOrder.putSendInfo);
    server.put({path:'/api/admin/:adminId/order/:orderId/receiveInfo',contentType: 'application/json'},inquiryOrder.putReceiveInfo);
    server.put({path:'/api/admin/:adminId/order/:orderId/sendInfo',contentType: 'application/json'},inquiryOrder.putSendInfo);
    server.put({path:'/api/admin/:adminId/order/:orderId/totalTransInsurePrice',contentType: 'application/json'},inquiryOrder.putFreightPrice);
    server.put({path:'/api/user/:userId/order/:orderId/status/:status',contentType: 'application/json'},inquiryOrder.putStatus);
    server.put({path:'/api/admin/:adminId/order/:orderId/status/:status',contentType: 'application/json'},inquiryOrder.putStatus);
    server.put({path:'/api/user/:userId/order/:orderId/cancel',contentType: 'application/json'},inquiryOrder.cancelOrder);
    server.put({path:'/api/admin/:adminId/order/:orderId/cancel',contentType: 'application/json'},inquiryOrder.cancelOrder);
    server.get('/api/user/:userId/order',inquiryOrder.getOrderByUser);
    server.get('/api/admin/:adminId/order',inquiryOrder.getOrder);
    server.put({path:'/api/user/:userId/order/:orderId/orderMark',contentType: 'application/json'},inquiryOrder.putMark);
    server.put({path:'/api/admin/:adminId/order/:orderId/adminMark',contentType: 'application/json'},inquiryOrder.putAdminMark);
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
    /**
     user_bank
     */
    server.post({path:'/api/user/:userId/inquiryBank',contentType: 'application/json'},inquiryBank.addInquiryBank);
    server.get('/api/user/:userId/inquiryBank',inquiryBank.getInquiryBank);
    server.get('/api/admin/:adminId/inquiryBank',inquiryBank.getInquiryBank);
    server.put({path:'/api/user/:userId/inquiryBank/:inquiryBankId/status/:status',contentType: 'application/json'},inquiryBank.updateInquiryBank);
    /**
     user_address
     */
    server.get('/api/admin/:adminId/userAddress',userAddress.getAddress);
    server.get('/api/user/:userId/userAddress',userAddress.getAddress);
    server.post({path:'/api/user/:userId/userAddress',contentType: 'application/json'},userAddress.addAddress);
    server.put({path:'/api/user/:userId/userAddress/:addressId/status/:status/',contentType: 'application/json'},userAddress.updateStatus);
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
    server.post({path:'/api/createAdmin',contentType: 'application/json'},adminUser.createAdminUser);
    server.get('/api/admin/:adminId' ,adminUser.getAdminUserInfo);
    server.post({path:'/api/admin/do/login',contentType: 'application/json'},adminUser.adminUserLogin);
    server.put({path:'/api/admin/:adminId',contentType: 'application/json'} ,adminUser.updateAdminInfo);
    server.put({path:'/api/admin/:adminId/password',contentType: 'application/json'} ,adminUser.changeAdminPassword);
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
    /**
     city_info
     */
    server.post({path:'/api/user/:userId/city',contentType: 'application/json'},city.addCity);
    server.post({path:'/api/admin/:adminId/city',contentType: 'application/json'},city.addCity);
    server.get('/api/user/:userId/city',city.queryCity);
    server.get('/api/admin/:adminId/city',city.queryCityAdmin);
    server.put({path:'/api/user/:userId/city/:cityId',contentType: 'application/json'},city.updateCity);
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
    server.get('/api/admin/:adminId/payment' ,payment.getPayment);
    server.get('/api/admin/:adminId/paymentRefund' ,payment.getRefundByPaymentId);
    server.post({path:'/api/user/:userId/order/:orderId/wechatPayment',contentType: 'application/json'},payment.addWechatPayment);
    server.post({path:'/api/wechatPayment',contentType: 'text/xml'},payment.updateWechatPayment);
    server.post({path:'/api/admin/:adminId/user/:userId/order/:orderId/wechatRefund',contentType: 'application/json'},payment.wechatRefund);
    server.post({path:'/api/wechatRefund',contentType: 'text/xml'},payment.addWechatRefund);
    server.put({path:'/api/admin/:adminId/payment/:paymentId/paymentRemark',contentType: 'application/json'},payment.updateRemark);
    server.post({path:'/api/user/:userId/order/:orderId/bankPayment',contentType: 'application/json'},payment.addBankPayment);
    server.post({path:'/api/admin/:adminId/order/:orderId/bankRefund',contentType: 'application/json'},payment.addBankRefund);
    server.put({path:'/api/admin/:adminId/payment/:paymentId/bankStatus/:status',contentType: 'application/json'},payment.updateBankStatus);
    server.put({path:'/api/user/:userId/payment/:paymentId/RefundRemark',contentType: 'application/json'},payment.updateRefundRemark);
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