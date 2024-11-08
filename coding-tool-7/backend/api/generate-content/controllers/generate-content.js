// backend/api/generate-content/controllers/generate-content.js

'use strict';

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async generate(ctx) {
    const { projectId, pageType } = ctx.request.body;

    // Validate input
    if (!projectId || !pageType) {
      return ctx.badRequest('Project ID and page type are required');
    }

    // Fetch project data
    const project = await strapi.services.project.findOne({ id: projectId });

    if (!project) {
      return ctx.notFound('Project not found');
    }

    // Check if user has permission to access this project
    if (ctx.state.user.id !== project.user.id) {
      return ctx.forbidden('You do not have permission to access this project');
    }

    // Fetch related data
    const companyInfo = await strapi.services['company-info'].findOne({ project: projectId });
    const services = await strapi.services.service.find({ project: projectId });
    const teamMembers = await strapi.services['team-member'].find({ project: projectId });

    // Construct prompt for AI
    const prompt = constructPrompt(project, companyInfo, services, teamMembers, pageType);

    try {
      // Generate content using AI service
      const generatedContent = await strapi.services['ai-service'].generateContent(prompt);

      // Save generated content
      const contentEntry = await strapi.services['generated-content'].create({
        project: projectId,
        pageType,
        contentData: generatedContent,
      });

      // Return the sanitized content
      return sanitizeEntity(contentEntry, { model: strapi.models['generated-content'] });
    } catch (error) {
      strapi.log.error('Content generation error:', error);
      return ctx.internalServerError('Failed to generate content');
    }
  }
};

function constructPrompt(project, companyInfo, services, teamMembers, pageType) {
  let prompt = `Generate content for a ${pageType} page for ${companyInfo.companyName}. `;

  switch (pageType) {
    case 'home':
      prompt += `Include a brief introduction, highlight key services, and add a call to action. `;
      break;
    case 'about':
      prompt += `Describe the company's history, mission, and values. Include information about the team. `;
      break;
    case 'services':
      prompt += `List and describe the following services: ${services.map(s => s.serviceName).join(', ')}. `;
      break;
    case 'contact':
      prompt += `Include contact information and a brief message encouraging visitors to get in touch. `;
      break;
    default:
      prompt += `Provide general information about the company and its services. `;
  }

  prompt += `Company Description: ${companyInfo.description}. `;
  
  if (services.length > 0) {
    prompt += `Services offered: ${services.map(s => s.serviceName).join(', ')}. `;
  }

  if (teamMembers.length > 0) {
    prompt += `Team members: ${teamMembers.map(t => t.memberName).join(', ')}. `;
  }

  prompt += `Ensure the content is engaging, professional, and optimized for SEO.`;

  return prompt;
}