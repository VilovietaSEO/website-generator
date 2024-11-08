module.exports = ({ env }) => ({
  settings: {
    cors: {
      enabled: true,
      origin: env('CORS_ORIGIN', 'http://localhost:3000').split(','),
      headers: ['*'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      keepHeaderOnError: true,
    },
    security: {
      csrf: {
        enabled: false,
      },
      xframe: {
        enabled: true,
        value: 'SAMEORIGIN',
      },
      hsts: {
        enabled: true,
        maxAge: 31536000,
        includeSubDomains: true,
      },
      xss: {
        enabled: true,
        mode: 'block',
      },
      noSniff: {
        enabled: true,
      },
    },
    poweredBy: {
      enabled: false,
    },
    gzip: {
      enabled: true,
    },
    logger: {
      level: env('LOG_LEVEL', 'debug'),
    },
    parser: {
      enabled: true,
      multipart: true,
      formLimit: '256mb',
      jsonLimit: '256mb',
      formidable: {
        maxFileSize: 200 * 1024 * 1024, // 200mb in bytes
      },
    },
  },
});