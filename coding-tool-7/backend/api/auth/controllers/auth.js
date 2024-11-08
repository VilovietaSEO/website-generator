const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async register(ctx) {
    const pluginStore = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    const settings = await pluginStore.get({
      key: 'advanced',
    });

    if (!settings.allow_register) {
      return ctx.badRequest(
        null,
        ctx.request.admin ? [{ messages: [{ id: 'Auth.advanced.allow_register' }] }] : 'Register action is currently disabled.'
      );
    }

    const params = {
      ...ctx.request.body,
      provider: 'local',
    };

    // Password is required.
    if (!params.password) {
      return ctx.badRequest(
        null,
        ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.password.provide' }] }] : 'Please provide your password.'
      );
    }

    // Email is required.
    if (!params.email) {
      return ctx.badRequest(
        null,
        ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.email.provide' }] }] : 'Please provide your email.'
      );
    }

    // Throw an error if the password selected by the user
    // contains more than three times the symbol '$'.
    if (strapi.plugins['users-permissions'].services.user.isHashed(params.password)) {
      return ctx.badRequest(
        null,
        ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.password.format' }] }] : 'Your password cannot contain more than three times the symbol `$`.'
      );
    }

    const role = await strapi
      .query('role', 'users-permissions')
      .findOne({ type: settings.default_role }, []);

    if (!role) {
      return ctx.badRequest(
        null,
        ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.role.notFound' }] }] : 'Impossible to find the default role.'
      );
    }

    // Check if the provided email is valid or not.
    const isEmail = emailRegExp.test(params.email);

    if (isEmail) {
      params.email = params.email.toLowerCase();
    } else {
      return ctx.badRequest(
        null,
        ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.email.format' }] }] : 'Please provide a valid email address.'
      );
    }

    params.role = role.id;
    params.password = await strapi.plugins['users-permissions'].services.user.hashPassword(params);

    const user = await strapi.query('user', 'users-permissions').findOne({
      email: params.email,
    });

    if (user && user.provider === params.provider) {
      return ctx.badRequest(
        null,
        ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.email.taken' }] }] : 'Email is already taken.'
      );
    }

    if (user && user.provider !== params.provider && settings.unique_email) {
      return ctx.badRequest(
        null,
        ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.email.taken' }] }] : 'Email is already taken.'
      );
    }

    try {
      if (!settings.email_confirmation) {
        params.confirmed = true;
      }

      const user = await strapi.query('user', 'users-permissions').create(params);

      const sanitizedUser = sanitizeEntity(user, {
        model: strapi.query('user', 'users-permissions').model,
      });

      if (settings.email_confirmation) {
        try {
          await strapi.plugins['users-permissions'].services.user.sendConfirmationEmail(user);
        } catch (err) {
          return ctx.badRequest(null, err);
        }

        return ctx.send({ user: sanitizedUser });
      }

      const jwt = strapi.plugins['users-permissions'].services.jwt.issue(_.pick(user, ['id']));

      return ctx.send({
        jwt,
        user: sanitizedUser,
      });
    } catch (err) {
      const adminError = _.includes(err.message, 'username')
        ? { id: 'Auth.form.error.username.taken' }
        : { id: 'Auth.form.error.email.taken' };

      ctx.badRequest(null, ctx.request.admin ? [{ messages: [adminError] }] : err.message);
    }
  },

  async login(ctx) {
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;

    const store = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    if (provider === 'local') {
      if (!_.get(await store.get({ key: 'grant' }), 'email.enabled')) {
        return ctx.badRequest(null, 'This provider is disabled.');
      }

      // The identifier is required.
      if (!params.identifier) {
        return ctx.badRequest(
          null,
          ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.email.provide' }] }] : 'Please provide your username or email.'
        );
      }

      // The password is required.
      if (!params.password) {
        return ctx.badRequest(
          null,
          ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.password.provide' }] }] : 'Please provide your password.'
        );
      }

      const query = { provider };

      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier);

      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const user = await strapi.query('user', 'users-permissions').findOne(query);

      if (!user) {
        return ctx.badRequest(
          null,
          ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.invalid' }] }] : 'Identifier or password invalid.'
        );
      }

      if (
        _.get(await store.get({ key: 'advanced' }), 'email_confirmation') &&
        user.confirmed !== true
      ) {
        return ctx.badRequest(
          null,
          ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.confirmed' }] }] : 'Your account email is not confirmed.'
        );
      }

      if (user.blocked === true) {
        return ctx.badRequest(
          null,
          ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.blocked' }] }] : 'Your account has been blocked by an administrator.'
        );
      }

      // The user never authenticated with the `local` provider.
      if (!user.password) {
        return ctx.badRequest(
          null,
          ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.password.local' }] }] : 'This user never set a local password, please login with the provider used during account creation.'
        );
      }

      const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
        params.password,
        user.password
      );

      if (!validPassword) {
        return ctx.badRequest(
          null,
          ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.invalid' }] }] : 'Identifier or password invalid.'
        );
      } else {
        ctx.send({
          jwt: strapi.plugins['users-permissions'].services.jwt.issue({
            id: user.id,
          }),
          user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
            model: strapi.query('user', 'users-permissions').model,
          }),
        });
      }
    } else {
      if (!_.get(await store.get({ key: 'grant' }), [provider, 'enabled'])) {
        return ctx.badRequest(
          null,
          ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.disabled' }] }] : 'This provider is disabled.'
        );
      }

      // Connect the user with the third-party provider.
      let user;
      let error;
      try {
        [user, error] = await strapi.plugins['users-permissions'].services.providers.connect(
          provider,
          ctx.query
        );
      } catch ([user, error]) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      if (!user) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      });
    }
  },

  async resetPassword(ctx) {
    const params = _.assign({}, ctx.request.body, ctx.params);

    if (
      params.password &&
      params.passwordConfirmation &&
      params.password === params.passwordConfirmation &&
      params.code
    ) {
      const user = await strapi
        .query('user', 'users-permissions')
        .findOne({ resetPasswordToken: `${params.code}` });

      if (!user) {
        return ctx.badRequest(
          null,
          ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.code.provide' }] }] : 'Incorrect code provided.'
        );
      }

      const password = await strapi.plugins['users-permissions'].services.user.hashPassword({
        password: params.password,
      });

      // Update the user.
      await strapi
        .query('user', 'users-permissions')
        .update({ id: user.id }, { resetPasswordToken: null, password });

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      });
    } else if (
      params.password &&
      params.passwordConfirmation &&
      params.password !== params.passwordConfirmation
    ) {
      return ctx.badRequest(
        null,
        ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.password.matching' }] }] : 'Passwords do not match.'
      );
    } else {
      return ctx.badRequest(
        null,
        ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.params.provide' }] }] : 'Incorrect params provided.'
      );
    }
  },

  async connect(ctx, next) {
    const grantConfig = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'grant',
      })
      .get();

    const [requestPath] = ctx.request.url.split('?');
    const provider = requestPath.split('/')[2];

    if (!_.get(grantConfig[provider], 'enabled')) {
      return ctx.badRequest(null, 'This provider is disabled.');
    }

    if (!strapi.config.server.url.startsWith('http')) {
      strapi.log.warn(
        'You are using a third party provider for login. Make sure to set an absolute url in config/server.js. More info here: https://strapi.io/documentation/developer-docs/latest/development/plugins/users-permissions.html#setting-up-the-server-url'
      );
    }

    // Ability to pass OAuth callback dynamically
    grantConfig[provider].callback = _.get(ctx, 'query.callback') || grantConfig[provider].callback;
    grantConfig[provider].redirect_uri = strapi.plugins[
      'users-permissions'
    ].services.providers.buildRedirectUri(provider);

    return grant(grantConfig)(ctx, next);
  },

  async forgotPassword(ctx) {
    let { email } = ctx.request.body;

    // Check if the provided email is valid or not.
    const isEmail = emailRegExp.test(email);

    if (isEmail) {
      email = email.toLowerCase();
    } else {
      return ctx.badRequest(
        null,
        ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.email.format' }] }] : 'Please provide a valid email address.'
      );
    }

    const pluginStore = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    // Find the user by email.
    const user = await strapi
      .query('user', 'users-permissions')
      .findOne({ email: email.toLowerCase() });

    // User not found.
    if (!user) {
      return ctx.badRequest(
        null,
        ctx.request.admin ? [{ messages: [{ id: 'Auth.form.error.user.not-exist' }] }] : 'This email does not exist.'
      );
    }

    // Generate random token.
    const resetPasswordToken = crypto.randomBytes(64).toString('hex');

    const settings = await pluginStore.get({ key: 'email' }).then(storeEmail => {
      try {
        return storeEmail['reset_password'].options;
      } catch (error) {
        return {};
      }
    });

    const advanced = await pluginStore.get({
      key: 'advanced',
    });

    const userInfo = sanitizeEntity(user, {
      model: strapi.query('user', 'users-permissions').model,
    });

    settings.message = await strapi.plugins['users-permissions'].services.userspermissions.template(
      settings.message,
      {
        URL: advanced.email_reset_password,
        USER: userInfo,
        TOKEN: resetPasswordToken,
      }
    );

    settings.object = await strapi.plugins['users-permissions'].services.userspermissions.template(
      settings.object,
      {
        USER: userInfo,
      