module.exports = {
  async create(ctx) {
    const { user } = ctx.state;
    const { projectName } = ctx.request.body;

    if (!projectName) {
      return ctx.badRequest('Project name is required');
    }

    const project = await strapi.services.project.create({
      projectName,
      user: user.id,
      status: 'draft'
    });

    return project;
  },

  async find(ctx) {
    const { user } = ctx.state;
    const projects = await strapi.services.project.find({ user: user.id });
    return projects;
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    const project = await strapi.services.project.findOne({ id, user: user.id });

    if (!project) {
      return ctx.notFound('Project not found');
    }

    return project;
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    const updateData = ctx.request.body;

    const project = await strapi.services.project.findOne({ id, user: user.id });

    if (!project) {
      return ctx.notFound('Project not found');
    }

    const updatedProject = await strapi.services.project.update({ id }, updateData);
    return updatedProject;
  },

  async delete(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    const project = await strapi.services.project.findOne({ id, user: user.id });

    if (!project) {
      return ctx.notFound('Project not found');
    }

    await strapi.services.project.delete({ id });
    return { message: 'Project deleted successfully' };
  },

  async publish(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    const project = await strapi.services.project.findOne({ id, user: user.id });

    if (!project) {
      return ctx.notFound('Project not found');
    }

    if (project.status === 'published') {
      return ctx.badRequest('Project is already published');
    }

    const updatedProject = await strapi.services.project.update({ id }, { status: 'published' });
    
    // Here you would typically trigger the actual publishing process
    // This could involve generating the static site, deploying to a hosting service, etc.
    // For MVP, we'll just update the status

    return updatedProject;
  }
};