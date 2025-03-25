import apiClient from "../../HttpClientConfig/axiosConfig";

export const getNotificationsByUserId = async (userId) => {
    try {
      const response = await apiClient.get(`/notifications`, { params: { userId } });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
      return [];
    }
};
