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
  export const getByFilter = async (startDate, endDate, requestId, userId) => {
    const response = await apiClient.get('/access-log/get-filter', {
      params: { startDate, endDate, requestId, userId}
    });
    return response.data;
  };