const path = require('path');
const restify = require('restify');


const sysConfig = require('./config/SystemConfig');
const serverLogger = require('./util/ServerLogger');
const logger = serverLogger.createLogger('Server');


const wechatBl = require('./bl/WechatBl');
const adminUser = require('./bl/AdminUser.js');
const user = require('./bl/User.js');
//const email = require('./bl/Email.js');
const city = require('./bl/City.js');
const route = require('./bl/Route.js');
const inquiry = require('./bl/Inquiry.js');
const supplier = require('./bl/Supplier.js');
const supplierBank = require('./bl/SupplierBank.js');
const supplierContact = require('./bl/SupplierContact.js');
const sms = require('./bl/Sms.js');


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
    server.get('/api/user/:userId/queryInquiry',inquiry.getInquiryByUserId);
    server.get('/api/user/:userId/inquiry/:inquiryId/car',inquiry.getInquiryCarByInquiryId);
    server.get('/api/user/:userId/inquiry/:inquiryId/order',inquiry.getInquiryOrderByInquiryId);
    server.get('/api/user/:userId/contact',inquiry.getInquiryContactByInquiryId);
    server.get('/api/user/:userId/bank',inquiry.getInquiryBankByInquiryId);
    server.get('/api/user/:userId/invoice',inquiry.getInquiryInvoiceByInquiryId);
    /**
     inquiry_manage
     */
    server.get('/api/user/:userId/inquiryManage',inquiry.getInquiryByUserId);
    server.put({path:'/api/user/:userId/inquiry/:inquiryId/status/:status',contentType: 'application/json'},inquiry.updateInquiryStatus);
    server.post('/api/user/:userId/inquiry/:inquiryId/addOrder',inquiry.addInquiryOrder);
    /**
     * Admin User Module
     */
    server.post({path:'/api/createAdmin',contentType: 'application/json'},adminUser.createAdminUser);
    server.get('/api/admin/:adminId' ,adminUser.getAdminUserInfo);
    server.post({path:'/api/admin/do/login',contentType: 'application/json'},adminUser.adminUserLogin);
    server.put({path:'/api/admin/:adminId',contentType: 'application/json'} ,adminUser.updateAdminInfo);
    server.put({path:'/api/admin/:adminId/password',contentType: 'application/json'} ,adminUser.changeAdminPassword);
    /**
     user
     */
    server.get('/api/user',user.queryUser);
    //server.post({path:'/api/wechatLogin',contentType: 'application/json'},user.userLogin);
    server.post({path:'/api/userLogin',contentType: 'application/json'},user.userLogin);
    server.put({path:'/api/user/:id',contentType: 'application/json'},user.updateUser);
    server.put({path:'/api/user/:id/password',contentType: 'application/json'},user.updatePassword);
    server.put({path:'/api/admin/:adminId/user/:id/wechatStatus/:wechatStatus',contentType: 'application/json'},user.updateStatus);
    server.put({path:'/api/user/:id/phone/:phone',contentType: 'application/json'},user.updatePhone);
    /**
     emil
     */
    //server.post({path:'/api/accountConfirmEmail',contentType: 'application/json'},email.sendAccountConfirmEmail);
    //server.get('/api/queryMailRecord',email.queryMailRecord);
    /**
     city_info
     */
    server.post({path:'/api/user/:userId/city',contentType: 'application/json'},city.addCity);
    server.get('/api/city',city.queryCity);
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
    server.post({path:'/api/user/:userId/supplier',contentType: 'application/json'},supplier.addSupplier);
    server.get('/api/user/:userId/querySupplier',supplier.querySupplier);
    server.put({path:'/api/user/:userId/supplier/:supplierId',contentType: 'application/json'},supplier.updateSupplier);
    server.del({path:'/api/user/:userId/delSupplier/:supplierId',contentType: 'application/json'},supplier.delSupplier);
    server.post({path:'/api/user/:userId/supplier/:supplierId/bank',contentType: 'application/json'},supplierBank.addSupplierBank);
    server.get('/api/user/:userId/supplier/:supplierId/queryBank',supplierBank.querySupplierBank);
    server.del({path:'/api/user/:userId/supplier/:supplierId/bank/:bankId',contentType: 'application/json'},supplierBank.delSupplierBank);
    server.post({path:'/api/user/:userId/supplier/:supplierId/contact',contentType: 'application/json'},supplierContact.addSupplierContact);
    server.get('/api/user/:userId/supplier/:supplierId/queryContact',supplierContact.querySupplierContact);
    server.del({path:'/api/user/:userId/supplier/:supplierId/contact/:contactId',contentType: 'application/json'},supplierContact.delSupplierContact);
    /**
     * sendPswdSms
     */
    server.post({path:'/api/user/:userId/phone/:phone/userPhoneSms',contentType: 'application/json'},sms.sendUserSms);

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