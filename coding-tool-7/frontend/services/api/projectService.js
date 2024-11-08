```javascript
import axiosInstance from './axiosInstance';

const projectService = {
  async createProject(projectData) {
    try {
      const response = await axiosInstance.post('/projects', projectData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  async getProjects() {
    try {
      const response = await axiosInstance.get('/projects');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  async getProjectById(projectId) {
    try {
      const response = await axiosInstance.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  async updateProject(projectId, projectData) {
    try {
      const response = await axiosInstance.put(`/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  async deleteProject(projectId) {
    try {
      const response = await axiosInstance.delete(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  async generateContent(projectId, pageType) {
    try {
      const response = await axiosInstance.post(`/projects/${projectId}/generate-content`, { pageType });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  async publishWebsite(projectId) {
    try {
      const response = await axiosInstance.post(`/projects/${projectId}/publish`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
};

export default projectService;
```