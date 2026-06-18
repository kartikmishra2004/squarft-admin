// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const getAuthToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const getAuthHeaders = ({ skipAuth = false } = {}) => {
  const token = getAuthToken();

  return {
    'Content-Type': 'application/json',
    ...(!skipAuth && token && { Authorization: `Bearer ${token}` }),
  };
};

export const handleApiError = async (response) => {
  const contentType = response.headers.get('content-type');
  let errorData;

  try {
    errorData = contentType?.includes('application/json')
      ? await response.json()
      : { message: await response.text() };
  } catch {
    errorData = { message: 'An unexpected error occurred' };
  }

  return {
    status: response.status,
    message: errorData.message || 'Something went wrong',
    errors: errorData.errors || [],
  };
};

export const apiRequest = async (endpoint, options = {}) => {
  const { skipAuth = false, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...getAuthHeaders({ skipAuth }),
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      throw await handleApiError(response);
    }

    const contentType = response.headers.get('content-type');
    return contentType?.includes('application/json')
      ? response.json()
      : { success: true };
  } catch (error) {
    if (error.status && error.message) {
      throw error;
    }

    throw {
      status: 0,
      message: error.message === 'Failed to fetch'
        ? `Unable to connect to backend at ${API_BASE_URL}. Make sure the backend server is running.`
        : error.message || 'Network error occurred',
      errors: [],
    };
  }
};

export default API_BASE_URL;
