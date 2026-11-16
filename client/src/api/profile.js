import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthConfig = () => {
  const token = localStorage.getItem('jobtrail_token');

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchProfile = async () => {
  const { data } = await axios.get(
    `${API_URL}/profile`,
    getAuthConfig()
  );

  return data.data;
};

export const updateProfile = async (profileData) => {
  const { data } = await axios.patch(
    `${API_URL}/profile`,
    profileData,
    getAuthConfig()
  );

  return data.data;
};