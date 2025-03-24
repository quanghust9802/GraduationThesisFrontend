import apiClient from "../../HttpClientConfig/axiosConfig";


export const loginUser = async (username, password) => {
  try {
    const response = await apiClient.post('/users/login', { username, password });
    return response.data; 
  } catch (error) {
    throw error;
  }


};
export const registerUser = async (formData) => {
  try {
    const response = await apiClient.post("/users/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (formData) => {
  try {
    const response = await apiClient.post("/users/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginGuest = async (username, password) => {
  try {
    const response = await apiClient.post('/users/login', { username, password });
    return response.data; 
  } catch (error) {
    throw error;
  }
};
