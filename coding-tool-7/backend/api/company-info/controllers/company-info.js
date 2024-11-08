```javascript
'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Create a company info record.
   * @param {Object} ctx - The context object containing the request data.
   * @return {Object} The created company info record.
   */
  async create(ctx) {
    let entity;
    const { user } = ctx.state;

    if (!user) {
      return ctx.unauthorized('You must be logged in to create a company info record.');
    }

    const { projectId, ...data } = ctx.request.body;

    // Ensure the user has permission to create for this project
    const project = await strapi.services.project.findOne({ id: projectId, user: user.id });
    if (!project) {
      return ctx.forbidden('You do not have permission to create company info for this project.');
    }

    entity = await strapi.services['company-info'].create({ ...data, project: projectId });
    return sanitizeEntity(entity, { model: strapi.models['company-info'] });
  },

  /**
   * Update a company info record.
   * @param {Object} ctx - The context object containing the request data.
   * @return {Object} The updated company info record.
   */
  async update(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    let entity = await strapi.services['company-info'].findOne({ id });

    if (!entity) {
      return ctx.notFound('Company info record not found.');
    }

    // Check if user has permission to update this record
    const project = await strapi.services.project.findOne({ id: entity.project.id, user: user.id });
    if (!project) {
      return ctx.forbidden('You do not have permission to update this company info.');
    }

    entity = await strapi.services['company-info'].update({ id }, ctx.request.body);
    return sanitizeEntity(entity, { model: strapi.models['company-info'] });
  },

  /**
   * Retrieve a company info record.
   * @param {Object} ctx - The context object containing the request data.
   * @return {Object} The requested company info record.
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    const entity = await strapi.services['company-info'].findOne({ id });

    if (!entity) {
      return ctx.notFound('Company info record not found.');
    }

    // Check if user has permission to view this record
    const project = await strapi.services.project.findOne({ id: entity.project.id, user: user.id });
    if (!project) {
      return ctx.forbidden('You do not have permission to view this company info.');
    }

    return sanitizeEntity(entity, { model: strapi.models['company-info'] });
  },

  /**
   * Delete a company info record.
   * @param {Object} ctx - The context object containing the request data.
   * @return {Object} The deleted company info record.
   */
  async delete(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    const entity = await strapi.services['company-info'].findOne({ id });

    if (!entity) {
      return ctx.notFound('Company info record not found.');
    }

    // Check if user has permission to delete this record
    const project = await strapi.services.project.findOne({ id: entity.project.id, user: user.id });
    if (!project) {
      return ctx.forbidden('You do not have permission to delete this company info.');
    }

    const deletedEntity = await strapi.services['company-info'].delete({ id });
    return sanitizeEntity(deletedEntity, { model: strapi.models['company-info'] });
  }
};
```