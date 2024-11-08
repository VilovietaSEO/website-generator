```javascript
'use strict';

/**
 * Service controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::service.service', ({ strapi }) => ({
  async create(ctx) {
    const { user } = ctx.state;
    const { projectId, ...serviceData } = ctx.request.body;

    // Ensure the user has permission to add a service to this project
    const project = await strapi.entityService.findOne('api::project.project', projectId, {
      populate: { user: true },
    });

    if (!project || project.user.id !== user.id) {
      return ctx.forbidden('You do not have permission to add a service to this project');
    }

    // Create the service
    const service = await strapi.entityService.create('api::service.service', {
      data: {
        ...serviceData,
        project: projectId,
      },
    });

    return service;
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    const updateData = ctx.request.body;

    // Fetch the service and check if the user has permission to update it
    const service = await strapi.entityService.findOne('api::service.service', id, {
      populate: { project: { populate: { user: true } } },
    });

    if (!service || service.project.user.id !== user.id) {
      return ctx.forbidden('You do not have permission to update this service');
    }

    // Update the service
    const updatedService = await strapi.entityService.update('api::service.service', id, {
      data: updateData,
    });

    return updatedService;
  },

  async delete(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    // Fetch the service and check if the user has permission to delete it
    const service = await strapi.entityService.findOne('api::service.service', id, {
      populate: { project: { populate: { user: true } } },
    });

    if (!service || service.project.user.id !== user.id) {
      return ctx.forbidden('You do not have permission to delete this service');
    }

    // Delete the service
    const deletedService = await strapi.entityService.delete('api::service.service', id);

    return deletedService;
  },

  async find(ctx) {
    const { user } = ctx.state;
    const { projectId } = ctx.query;

    // If projectId is provided, ensure the user has access to the project
    if (projectId) {
      const project = await strapi.entityService.findOne('api::project.project', projectId, {
        populate: { user: true },
      });

      if (!project || project.user.id !== user.id) {
        return ctx.forbidden('You do not have permission to access services for this project');
      }

      // Fetch services for the specific project
      const services = await strapi.entityService.findMany('api::service.service', {
        filters: { project: projectId },
      });

      return services;
    }

    // If no projectId, fetch all services for projects owned by the user
    const userProjects = await strapi.entityService.findMany('api::project.project', {
      filters: { user: user.id },
    });

    const projectIds = userProjects.map(project => project.id);

    const services = await strapi.entityService.findMany('api::service.service', {
      filters: { project: { id: { $in: projectIds } } },
    });

    return services;
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    const service = await strapi.entityService.findOne('api::service.service', id, {
      populate: { project: { populate: { user: true } } },
    });

    if (!service || service.project.user.id !== user.id) {
      return ctx.forbidden('You do not have permission to access this service');
    }

    return service;
  },
}));
```