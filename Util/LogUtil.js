var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' }, //控制台输出
        {
            type: 'dateFile',
            absolute: true,
            filename: 'logs/access',
            maxLogSize: 1024 * 1024,
            backup: 3,
            pattern: "-yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            category: 'normal'
        }
    ],
    replaceConsole: true
});


module.exports = {
    logger: function() {
        var logger = log4js.getLogger('normal');
        logger.setLevel('INFO');
        return logger;
    }
}
