import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthConfig = () => {
  const token = localStorage.getItem('jobtrail_token');

  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

export const fetchApplications = async () => {
  const { data } = await axios.get(
    `${API_URL}/applications`,
    getAuthConfig()
  );

  return data.data ?? data;
};

export const fetchApplicationById = async (id) => {
  const { data } = await axios.get(
    `${API_URL}/applications/${id}`,
    getAuthConfig()
  );

  return data.data ?? data;
};

export const createApplication = async (appData) => {
  const payload = {
    ...appData,
    notes: appData.notes ?? [],
    interviews: appData.interviews ?? [],
    history: appData.history ?? [
      {
        status: appData.status,
        at: appData.appliedDate || new Date().toISOString().slice(0, 10),
      },
    ],
  };

  const { data } = await axios.post(
    `${API_URL}/applications`,
    payload,
    getAuthConfig()
  );

  return data.data ?? data;
};

export const updateApplication = async (id, appData) => {
  const { data } = await axios.patch(
    `${API_URL}/applications/${id}`,
    appData,
    getAuthConfig()
  );

  return data.data ?? data;
};

export const deleteApplication = async (id) => {
  await axios.delete(
    `${API_URL}/applications/${id}`,
    getAuthConfig()
  );

  return id;
};

export const fetchStats = async () => {
  const { data } = await axios.get(
    `${API_URL}/applications/stats`,
    getAuthConfig()
  );

  return data.data ?? data;
};