```javascript
'use strict';

const { sanitizeEntity } = require('strapi-utils');
const jwt = require('jsonwebtoken');

module.exports = {
  async login(ctx) {
    const { identifier, password } = ctx.request.body;

    const user = await strapi.query('user', 'users-permissions').findOne({
      email: identifier,
    });

    if (!user) {
      return ctx.badRequest('Invalid identifier or password');
    }

    const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
      password,
      user.password
    );

    if (!validPassword) {
      return ctx.badRequest('Invalid identifier or password');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return {
      jwt: token,
      user: sanitizeEntity(user, { model: strapi.models.user }),
    };
  },

  async register(ctx) {
    const { email, password, username } = ctx.request.body;

    if (!email || !password || !username) {
      return ctx.badRequest('Please provide all required fields');
    }

    const existingUser = await strapi.query('user', 'users-permissions').findOne({ email });

    if (existingUser) {
      return ctx.badRequest('Email is already taken');
    }

    const user = await strapi.plugins['users-permissions'].services.user.add({
      email,
      password,
      username,
      provider: 'local',
      role: await strapi.query('role', 'users-permissions').findOne({ type: 'authenticated' }),
      confirmed: true,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return {
      jwt: token,
      user: sanitizeEntity(user, { model: strapi.models.user }),
    };
  },

  async forgotPassword(ctx) {
    const { email } = ctx.request.body;

    const user = await strapi.query('user', 'users-permissions').findOne({ email });

    if (!user) {
      return ctx.badRequest('Email not found');
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    await strapi.plugins['email'].services.email.send({
      to: user.email,
      from: 'noreply@yourdomain.com',
      subject: 'Reset your password',
      text: `Use this token to reset your password: ${resetToken}`,
      html: `<p>Use this token to reset your password: ${resetToken}</p>`,
    });

    return { message: 'Password reset email sent' };
  },

  async resetPassword(ctx) {
    const { token, password } = ctx.request.body;

    if (!token || !password) {
      return ctx.badRequest('Token and new password are required');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return ctx.badRequest('Invalid or expired token');
    }

    const user = await strapi.query('user', 'users-permissions').findOne({ id: decoded.id });

    if (!user) {
      return ctx.badRequest('User not found');
    }

    const updatedUser = await strapi.plugins['users-permissions'].services.user.edit(
      { id: user.id },
      { password }
    );

    return {
      user: sanitizeEntity(updatedUser, { model: strapi.models.user }),
    };
  },
};
```