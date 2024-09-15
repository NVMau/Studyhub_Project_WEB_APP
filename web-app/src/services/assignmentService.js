import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import keycloak from "../keycloak";

// Thêm bài tập mới
export const createAssignment = async (assignmentData) => {
  return await httpClient.post(`${API.CREATE_ASSIGNMENT}`, assignmentData, {
    headers: {
      Authorization: "Bearer " + keycloak.token,
      "Content-Type": "application/json",  // Đảm bảo contentType phù hợp với payload bạn gửi
    },
  });
};

// Có thể thêm các function khác để lấy danh sách bài tập, xóa bài tập, cập nhật bài tập,...
