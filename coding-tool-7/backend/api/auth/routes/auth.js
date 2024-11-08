module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/local/register',
      handler: 'auth.register',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/auth/local',
      handler: 'auth.login',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/auth/forgot-password',
      handler: 'auth.forgotPassword',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/auth/reset-password',
      handler: 'auth.resetPassword',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/auth/me',
      handler: 'auth.getMe',
      config: {
        policies: ['is-authenticated'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/auth/update-profile',
      handler: 'auth.updateProfile',
      config: {
        policies: ['is-authenticated'],
        middlewares: [],
      },
    },
  ],
};