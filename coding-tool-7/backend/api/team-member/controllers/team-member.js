```javascript
'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Create a team member
   * @param {Object} ctx - The context object containing the request parameters
   * @return {Object} The created team member entity
   */
  async create(ctx) {
    let entity;
    const { user } = ctx.state;
    const { project } = ctx.request.body;

    // Ensure the user has permission to add team members to this project
    const userProject = await strapi.services.project.findOne({ id: project, user: user.id });
    if (!userProject) {
      return ctx.unauthorized(`You don't have permission to add team members to this project.`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services['team-member'].create(data, { files });
    } else {
      entity = await strapi.services['team-member'].create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models['team-member'] });
  },

  /**
   * Update a team member
   * @param {Object} ctx - The context object containing the request parameters
   * @return {Object} The updated team member entity
   */
  async update(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    let entity;

    const [teamMember] = await strapi.services['team-member'].find({
      id: ctx.params.id,
      'project.user': user.id,
    });

    if (!teamMember) {
      return ctx.unauthorized(`You don't have permission to update this team member.`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services['team-member'].update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services['team-member'].update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models['team-member'] });
  },

  /**
   * Delete a team member
   * @param {Object} ctx - The context object containing the request parameters
   * @return {Object} The deleted team member entity
   */
  async delete(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    const [teamMember] = await strapi.services['team-member'].find({
      id: ctx.params.id,
      'project.user': user.id,
    });

    if (!teamMember) {
      return ctx.unauthorized(`You don't have permission to delete this team member.`);
    }

    const entity = await strapi.services['team-member'].delete({ id });
    return sanitizeEntity(entity, { model: strapi.models['team-member'] });
  },

  /**
   * Get team members for a project
   * @param {Object} ctx - The context object containing the request parameters
   * @return {Array} An array of team member entities for the project
   */
  async findByProject(ctx) {
    const { projectId } = ctx.params;
    const { user } = ctx.state;

    const project = await strapi.services.project.findOne({ id: projectId, user: user.id });
    if (!project) {
      return ctx.unauthorized(`You don't have permission to view team members for this project.`);
    }

    const entities = await strapi.services['team-member'].find({ project: projectId });
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models['team-member'] }));
  },
};
```