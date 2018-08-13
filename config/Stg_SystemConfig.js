const mysqlConnectOptions ={
    user: 'log',
    password: 'log_mp',
    database:'log_mp',
    host: '127.0.0.1' ,
    charset : 'utf8mb4',
    //,dateStrings : 'DATETIME'
};


const logLevel = 'DEBUG';
const loggerConfig = {
    appenders: {
        console: { type: 'console' } ,
        file : {
            "type": "file",
            "filename": "../log_mp_api.html",
            "maxLogSize": 2048000,
            "backups": 10
        }
    },
    categories: { default: { appenders: ['console','file'], level: 'debug' } }
}


const mongoConfig = {
    connect : 'mongodb://127.0.0.1:27017/log_mp'
}

const wechatConfig = {
    mpAppId : "wx8063556bcdab3e2b",
    mpSecret : "a7c5c6cd22d89a3eea6c739a1a3c74d1",
    mphost : ""
}


module.exports = { mysqlConnectOptions ,loggerConfig, logLevel , mongoConfig ,wechatConfig }
