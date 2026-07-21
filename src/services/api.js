import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkHealth = async () => {
  const response = await axios.get('http://127.0.0.1:8080/health');
  return response.data;
};

export const analyzeToken = async (tokenData) => {
  const response = await apiClient.post('/analyze', tokenData);
  return response.data;
};

export const batchAnalyzeTokens = async (tokensList) => {
  const response = await apiClient.post('/batch-analyze', { tokens: tokensList });
  return response.data;
};

export default apiClient;
