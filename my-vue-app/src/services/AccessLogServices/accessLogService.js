import apiClient from "../../HttpClientConfig/axiosConfig";

export const getAccessLogs = async () => {
  const response = await apiClient.get('/access-log');
  return response.data;
};


export const getByUserId = async (userId) => {
    const response = await apiClient.get(`/access-log/get-by-userid`, {
      params: { userId },
    });
    return response.data;
  };
  
  export const getByRequestId = async (requestId) => {
    const response = await apiClient.get(`/access-log/get-by-requestid`, {
      params: { requestId },
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
  export const getByFilter = async (startDate, endDate, requestId) => {
    const response = await apiClient.get('/access-log/get-filter', {
      params: { startDate, endDate, requestId }
    });
    return response.data;
  };