import axios from '../utils/axios';

export const verifyEmail = async (userEmail, verificationCode) => {
  try {
    const response = await axios.post('/api/auth/verify-email', {
      email: userEmail,
      code: verificationCode,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to verify email');
    } else if (error.request) {
      throw new Error('No response from server. Please try again.');
    } else {
      throw new Error('Error verifying email. Please try again.');
    }
  }
};

export const resendVerificationCode = async (userEmail) => {
  try {
    const response = await axios.post('/api/auth/resend-verification', {
      email: userEmail,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to resend verification code');
    } else if (error.request) {
      throw new Error('No response from server. Please try again.');
    } else {
      throw new Error('Error sending verification code. Please try again.');
    }
  }
};
