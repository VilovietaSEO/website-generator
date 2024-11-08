```javascript
'use strict';

/**
 * company-info service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::company-info.company-info', ({ strapi }) =>  ({
  async create(data, { files } = {}) {
    const validData = await strapi.entityValidator.validateEntityCreation(
      strapi.getModel('api::company-info.company-info'),
      data
    );

    const entry = await super.create(validData);

    if (files) {
      await this.uploadFiles(entry, files);
    }

    return this.findOne({ id: entry.id });
  },

  async update(entityId, data, { files } = {}) {
    const validData = await strapi.entityValidator.validateEntityUpdate(
      strapi.getModel('api::company-info.company-info'),
      data
    );

    const entry = await super.update(entityId, validData);

    if (files) {
      await this.uploadFiles(entry, files);
    }

    return this.findOne({ id: entry.id });
  },

  async uploadFiles(entry, files) {
    const uploadService = strapi.plugin('upload').service('upload');
    const { id } = entry;

    for (const key in files) {
      if (Object.hasOwnProperty.call(files, key)) {
        const file = files[key];

        if (Array.isArray(file)) {
          const uploads = await Promise.all(
            file.map((f) => uploadService.upload({
              data: { refId: id, ref: 'api::company-info.company-info', field: key },
              files: f
            }))
          );
          entry[key] = uploads.map(upload => upload[0].id);
        } else {
          const upload = await uploadService.upload({
            data: { refId: id, ref: 'api::company-info.company-info', field: key },
            files: file
          });
          entry[key] = upload[0].id;
        }
      }
    }

    await super.update(id, entry);
  },

  async findByProject(projectId) {
    return strapi.db.query('api::company-info.company-info').findOne({
      where: { project: projectId },
      populate: ['logo']
    });
  },

  async validateAndSanitize(data) {
    const { address, socialMediaLinks, ...rest } = data;

    // Validate and sanitize address
    const sanitizedAddress = address ? {
      street: strapi.sanitize.sanitizers.stripTags(address.street || ''),
      city: strapi.sanitize.sanitizers.stripTags(address.city || ''),
      state: strapi.sanitize.sanitizers.stripTags(address.state || ''),
      zip: strapi.sanitize.sanitizers.stripTags(address.zip || ''),
      country: strapi.sanitize.sanitizers.stripTags(address.country || '')
    } : {};

    // Validate and sanitize socialMediaLinks
    const sanitizedSocialMediaLinks = socialMediaLinks ? socialMediaLinks.map(link => ({
      platform: strapi.sanitize.sanitizers.stripTags(link.platform || ''),
      url: strapi.sanitize.sanitizers.stripTags(link.url || '')
    })) : [];

    // Sanitize other fields
    const sanitizedData = {
      ...rest,
      companyName: strapi.sanitize.sanitizers.stripTags(rest.companyName || ''),
      tagline: strapi.sanitize.sanitizers.stripTags(rest.tagline || ''),
      description: strapi.sanitize.sanitizers.stripTags(rest.description || ''),
      phoneNumber: strapi.sanitize.sanitizers.stripTags(rest.phoneNumber || ''),
      emailAddress: strapi.sanitize.sanitizers.stripTags(rest.emailAddress || ''),
      businessHours: strapi.sanitize.sanitizers.stripTags(rest.businessHours || ''),
      address: sanitizedAddress,
      socialMediaLinks: sanitizedSocialMediaLinks
    };

    return sanitizedData;
  }
}));
```