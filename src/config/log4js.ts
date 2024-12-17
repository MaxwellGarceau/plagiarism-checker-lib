import log4js from 'log4js';

log4js.configure({
    appenders: {
        console: { type: 'console' },
        file: { type: 'file', filename: 'logs/app.log' },
        errors: { type: 'file', filename: 'logs/errors.log' },
    },
    categories: {
        default: { appenders: ['console'], level: 'info' },
        app: { appenders: ['console', 'file'], level: 'debug' },
        error: { appenders: ['errors'], level: 'error' },
    },
});

export const appLogger = log4js.getLogger('app');
export const errorLogger = log4js.getLogger('error');
