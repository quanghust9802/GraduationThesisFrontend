import apiClient from "../../HttpClientConfig/axiosConfig";

export const getUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};


export const getUserById = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};


export const insertUser = async (formData) => {
  const response = await apiClient.post('/users', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateUser = async (id, formData) => {
  const response = await apiClient.put(`/users/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteUser  = async (id) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export const disableUser = async (id) => {
  const response = await apiClient.put(`/users/disable/${id}`);
  return response.data;
};