import apiClient from "../../HttpClientConfig/axiosConfig";

export const getAccessRequests = async () => {
  const response = await apiClient.get('/access-request');
  return response.data;
};

  export const getByFilter = async (startDate, endDate, requestId) => {
    const response = await apiClient.get('/access-request/get-filter', {
      params: { startDate, endDate, requestId }
    });
    return response.data;
  };

  
  export const getByStatus = async (userId, status) => {
    const response = await apiClient.get('/access-request/get-status', {
      params: { userId, status }
    });
    return response.data;
  };

    
  export const createRequest = async (formData) => {
    try {
      const response = await apiClient.post("/access-request/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };