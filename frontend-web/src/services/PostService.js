import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

class PostService {
  async createPost(token, postData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts`, postData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async getFeed(token, page = 1, limit = 20) {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/feed?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async likePost(token, postId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async addComment(token, postId, content) {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/${postId}/comments`, 
        { content }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async getComments(postId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/${postId}/comments`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async generateAIPost(token, prompt, type = 'code') {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/generate-post`, 
        { prompt, type }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async generateHashtags(token, content) {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/generate-hashtags`, 
        { content }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }
}

export default new PostService();