```javascript
const axios = require('axios');

module.exports = {
  async generateContent(prompt, projectData) {
    const API_URL = process.env.CLAUDE_API_URL;
    const API_KEY = process.env.CLAUDE_API_KEY;

    try {
      const enhancedPrompt = this.enhancePrompt(prompt, projectData);
      
      const response = await axios.post(
        API_URL,
        {
          prompt: enhancedPrompt,
          max_tokens_to_sample: 1000,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
        }
      );

      if (response.data && response.data.completion) {
        return this.processAIResponse(response.data.completion);
      } else {
        throw new Error('Invalid response from AI service');
      }
    } catch (error) {
      console.error('AI Content Generation Error:', error);
      throw new Error('Content generation failed. Please try again later.');
    }
  },

  enhancePrompt(basePrompt, projectData) {
    const { companyName, industry, services, targetAudience } = projectData;
    return `${basePrompt}\n\nCompany: ${companyName}\nIndustry: ${industry}\nServices: ${services.join(', ')}\nTarget Audience: ${targetAudience}`;
  },

  processAIResponse(rawResponse) {
    // Here you can add any post-processing logic
    // For example, cleaning up the text, formatting, etc.
    return rawResponse.trim();
  },

  async generatePageContent(pageType, projectData) {
    const promptTemplates = {
      home: "Generate engaging content for a home page that introduces the company and its main services. Include a compelling headline, a brief company description, and key benefits for customers.",
      about: "Create content for an 'About Us' page that tells the company's story, mission, and values. Include a brief history and what sets the company apart from competitors.",
      services: "Produce detailed descriptions for each of the company's services. For each service, include its benefits, key features, and why customers should choose it.",
      contact: "Generate content for a contact page that encourages visitors to get in touch. Include a brief message about the company's commitment to customer service and what customers can expect when they reach out."
    };

    const basePrompt = promptTemplates[pageType] || "Generate website content based on the following information:";
    return this.generateContent(basePrompt, projectData);
  }
};
```