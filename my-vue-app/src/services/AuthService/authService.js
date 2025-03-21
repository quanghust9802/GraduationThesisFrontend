import apiClient from "../../HttpClientConfig/axiosConfig";


export const loginUser = async (username, password) => {
  try {
    const response = await apiClient.post('/users/login', { username, password });
    return response.data; 
  } catch (error) {
    throw error;
  }


};
export const registerUser = async (customerData) => {
  try {
    const response = await apiClient.post('/users/create', customerData);
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
