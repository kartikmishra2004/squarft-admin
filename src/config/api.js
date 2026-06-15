// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Get authentication token from localStorage
 * @returns {string|null} JWT token or null
 */
export const getAuthToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Create headers with authentication token
 * @returns {Object} Headers object with Authorization
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Generic API error handler
 * @param {Response} response - Fetch response object
 * @returns {Promise<Object>} Error object with message and status
 */
export const handleApiError = async (response) => {
  const contentType = response.headers.get('content-type');
  let errorData;

  try {
    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json();
    } else {
      errorData = { message: await response.text() };
    }
  } catch {
    errorData = { message: 'An unexpected error occurred' };
  }

  return {
    status: response.status,
    message: errorData.message || 'Something went wrong',
    errors: errorData.errors || [],
  };
};

/**
 * Generic API request handler with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const requestId = Math.random().toString(36).substring(7);
  
  console.group(`🌐 [API REQUEST ${requestId}]`);
  console.log('⏱️ Request Time:', new Date().toISOString());
  console.log('📍 Endpoint:', endpoint);
  console.log('📦 Method:', options.method || 'GET');
  
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🔗 Full URL:', url);
    
    const token = getAuthToken();
    console.log('🔐 Auth Token Present:', !!token);
    if (token) {
      console.log('🔑 Token Length:', token.length);
      console.log('🔑 Token Preview:', token.substring(0, 30) + '...');
    } else {
      console.warn('⚠️ WARNING: No authentication token found!');
    }
    
    const config = {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    };
    
    console.log('📋 Request Headers:', JSON.stringify(config.headers, null, 2));
    
    if (options.body) {
      console.log('📤 Request Body:', options.body);
      try {
        const parsedBody = JSON.parse(options.body);
        console.log('📤 Parsed Body:', JSON.stringify(parsedBody, null, 2));
      } catch (e) {
        console.log('📤 Body (not JSON):', options.body);
      }
    }

    console.log('🚀 Sending request...');
    const response = await fetch(url, config);
    console.log('📥 Response Status:', response.status, response.statusText);
    console.log('📥 Response OK:', response.ok);
    console.log('📥 Response Headers:', {
      'content-type': response.headers.get('content-type'),
      'content-length': response.headers.get('content-length'),
    });

    if (!response.ok) {
      console.error('❌ Response NOT OK - Processing Error...');
      const error = await handleApiError(response);
      console.error('📛 Error Object:', JSON.stringify(error, null, 2));
      console.error('📛 Status:', error.status);
      console.error('📛 Message:', error.message);
      console.error('📛 Errors Array:', error.errors);
      console.groupEnd();
      throw error;
    }

    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
      console.log('✅ Response Data (JSON):', JSON.stringify(responseData, null, 2));
    } else {
      responseData = { success: true };
      console.log('✅ Response Data (Non-JSON):', responseData);
    }
    
    console.groupEnd();
    return responseData;
  } catch (error) {
    console.error('❌ API Request Failed');
    console.error('📛 Error Type:', error.constructor.name);
    console.error('📛 Error Message:', error.message);
    console.error('📛 Error Status:', error.status);
    console.error('📛 Full Error:', error);
    
    // If error already has our structure (from handleApiError), throw it
    if (error.status && error.message) {
      console.error('📛 Structured Error - Rethrowing');
      console.groupEnd();
      throw error;
    }

    // Network or other errors
    const networkError = {
      status: 0,
      message: error.message || 'Network error occurred',
      errors: [],
    };
    console.error('📛 Network Error:', networkError);
    console.groupEnd();
    throw networkError;
  }
};

export default API_BASE_URL;
