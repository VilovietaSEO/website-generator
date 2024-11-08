module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'your-secret-here'),
    },
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  middleware: {
    timeout: env.int('MIDDLEWARE_TIMEOUT', 100),
    load: {
      before: ['responseTime', 'logger', 'cors', 'responses', 'gzip'],
      order: [
        "Define custom middleware order here",
      ],
      after: ['parser', 'router'],
    },
  },
  settings: {
    cors: {
      enabled: true,
      origin: env.array('CORS_ORIGIN', ['http://localhost:3000']),
    },
  },
});