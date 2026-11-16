import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: email.trim().toLowerCase(),
      password,
    });

    const result = response.data?.data;

    if (!result?.user || !result?.token) {
      throw new Error('Invalid login response from the server.');
    }

    return {
      user: result.user,
      token: result.token,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid email or password.');
    }

    if (error.response?.status === 400) {
      throw new Error(
        error.response.data?.error?.message ||
          'Please check your email and password.',
      );
    }

    if (!error.response) {
      throw new Error(
        error.message ||
          'Cannot connect to the server. Check whether the backend is running.',
      );
    }

    throw new Error(
      error.response.data?.error?.message ||
        error.message ||
        'Login failed. Please try again.',
    );
  }
};

export const registerUser = async ({ name, email, password }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    const result = response.data?.data;

    if (!result?.user || !result?.token) {
      throw new Error('Invalid registration response from the server.');
    }

    return {
      user: result.user,
      token: result.token,
    };
  } catch (error) {
    if (!error.response) {
      throw new Error(
        error.message ||
          'Cannot connect to the server. Check whether the backend is running.',
      );
    }

    throw new Error(
      error.response.data?.error?.message ||
        error.message ||
        'Registration failed. Please try again.',
    );
  }
};