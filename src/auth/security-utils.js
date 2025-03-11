import axios from '../utils/axios';
import { store } from '../redux/store';


export const get2FAStatus = async () => {
  try {
    const userEmail = sessionStorage.getItem("userEmail");
    console.log("userEmail", userEmail);
    const response = await axios.post('/api/auth/get-2fa-status', { email: userEmail });
    console.log("response.data", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get 2FA status');
  }
};

export const setup2FA = async () => {
  try {
    // Get user data from Redux store
    const userData = store.getState().user.user;
    const userEmail = sessionStorage.getItem("userEmail");
    
    const response = await axios.post('/api/auth/setup-2FA', {
      email: userEmail,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log("response.data", response.data.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to enable 2FA');
  }
};

export const verify2FA = async (token) => {
  const userEmail = sessionStorage.getItem("userEmail");
  try {
    const response = await axios.post('/api/auth/verify-2fa', { token, email: userEmail });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify 2FA code');
  }
};

export const disable2FA = async (token) => {
  const userEmail = sessionStorage.getItem("userEmail");
  try {
    const response = await axios.post('/api/auth/disable-2fa', { token, email: userEmail });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to disable 2FA');
  }
};

// Alternative version using hooks in a component
export const useEnable2FA = async (token) => {
  const userEmail = sessionStorage.getItem("userEmail");
  try {
    console.log("token", token);
    const response = await axios.post('/api/auth/enable-2fa', {
      email: userEmail,
      token,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to enable 2FA');
  }
}; 