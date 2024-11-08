```javascript
import axiosInstance from './axiosInstance';

const authService = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/local', {
        identifier: email,
        password: password
      });
      if (response.data.jwt) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  register: async (username, email, password) => {
    try {
      const response = await axiosInstance.post('/auth/local/register', {
        username,
        email,
        password
      });
      if (response.data.jwt) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  updateUserProfile: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', {
        email: email
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  resetPassword: async (code, password, passwordConfirmation) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        code,
        password,
        passwordConfirmation
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  refreshToken: async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.jwt) {
        const response = await axiosInstance.post('/auth/refresh-token', {
          refreshToken: currentUser.jwt
        });
        if (response.data.jwt) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      }
      return null;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
};

export default authService;
```