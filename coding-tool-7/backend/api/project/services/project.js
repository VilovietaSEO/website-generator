```javascript
'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Create a project
   * @param {Object} data 
   * @param {Object} user 
   */
  async create(data, user) {
    const entity = await strapi.query('project').create({
      ...data,
      user: user.id,
    });
    return sanitizeEntity(entity, { model: strapi.models.project });
  },

  /**
   * Update a project
   * @param {Object} params 
   * @param {Object} data 
   * @param {Object} user 
   */
  async update(params, data, user) {
    const project = await strapi.query('project').findOne({ id: params.id, user: user.id });
    if (!project) {
      throw new Error('Project not found or you do not have permission to update it');
    }
    const entity = await strapi.query('project').update(
      { id: params.id },
      { ...data }
    );
    return sanitizeEntity(entity, { model: strapi.models.project });
  },

  /**
   * Delete a project
   * @param {Object} params 
   * @param {Object} user 
   */
  async delete(params, user) {
    const project = await strapi.query('project').findOne({ id: params.id, user: user.id });
    if (!project) {
      throw new Error('Project not found or you do not have permission to delete it');
    }
    const entity = await strapi.query('project').delete({ id: params.id });
    return sanitizeEntity(entity, { model: strapi.models.project });
  },

  /**
   * Find user's projects
   * @param {Object} params 
   * @param {Object} user 
   */
  async find(params, user) {
    const entities = await strapi.query('project').find({ user: user.id, ...params });
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.project }));
  },

  /**
   * Find one project
   * @param {Object} params 
   * @param {Object} user 
   */
  async findOne(params, user) {
    const entity = await strapi.query('project').findOne({ id: params.id, user: user.id });
    if (!entity) {
      throw new Error('Project not found or you do not have permission to view it');
    }
    return sanitizeEntity(entity, { model: strapi.models.project });
  },

  /**
   * Count projects
   * @param {Object} params 
   * @param {Object} user 
   */
  async count(params, user) {
    return await strapi.query('project').count({ user: user.id, ...params });
  },
};
```