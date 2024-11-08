```javascript
import axiosInstance from './axiosInstance';

const companyInfoService = {
  getCompanyInfo: async (projectId) => {
    try {
      const response = await axiosInstance.get(`/company-info/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company info:', error);
      throw error;
    }
  },

  updateCompanyInfo: async (projectId, companyData) => {
    try {
      const response = await axiosInstance.put(`/company-info/${projectId}`, companyData);
      return response.data;
    } catch (error) {
      console.error('Error updating company info:', error);
      throw error;
    }
  },

  createCompanyInfo: async (projectId, companyData) => {
    try {
      const response = await axiosInstance.post('/company-info', { ...companyData, project: projectId });
      return response.data;
    } catch (error) {
      console.error('Error creating company info:', error);
      throw error;
    }
  },

  uploadLogo: async (projectId, file) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('ref', 'company-info');
      formData.append('refId', projectId);
      formData.append('field', 'logo');

      const response = await axiosInstance.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  }
};

export default companyInfoService;
```