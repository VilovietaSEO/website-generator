module.exports = {
  /**
   * Create a new service
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    const validData = await strapi.entityValidator.validateEntityCreation(
      strapi.models.service,
      data
    );
    const entry = await strapi.query('service').create(validData);
    return entry;
  },

  /**
   * Update an existing service
   * @param {Object} params
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(params, data) {
    const existingEntry = await strapi.services.service.findOne(params);
    if (!existingEntry) {
      throw new Error('Service not found');
    }
    const validData = await strapi.entityValidator.validateEntityUpdate(
      strapi.models.service,
      data
    );
    const entry = await strapi.query('service').update(params, validData);
    return entry;
  },

  /**
   * Delete a service
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async delete(params) {
    const entry = await strapi.query('service').delete(params);
    return entry;
  },

  /**
   * Find a single service
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async findOne(params) {
    const entry = await strapi.query('service').findOne(params);
    return entry;
  },

  /**
   * Find multiple services
   * @param {Object} params
   * @returns {Promise<Array>}
   */
  async find(params) {
    const entries = await strapi.query('service').find(params);
    return entries;
  },

  /**
   * Count services
   * @param {Object} params
   * @returns {Promise<Number>}
   */
  async count(params) {
    const count = await strapi.query('service').count(params);
    return count;
  },

  /**
   * Search for services
   * @param {Object} params
   * @returns {Promise<Array>}
   */
  async search(params) {
    const entries = await strapi.query('service').search(params);
    return entries;
  },

  /**
   * Get services for a specific project
   * @param {string} projectId
   * @returns {Promise<Array>}
   */
  async getServicesForProject(projectId) {
    const entries = await strapi.query('service').find({ project: projectId });
    return entries;
  },

  /**
   * Validate service data
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async validateServiceData(data) {
    const validData = await strapi.entityValidator.validateEntityCreation(
      strapi.models.service,
      data
    );
    return validData;
  }
};