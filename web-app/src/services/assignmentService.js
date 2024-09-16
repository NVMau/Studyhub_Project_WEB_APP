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

// API để lấy danh sách bài tập theo bài giảng
export const getAssignmentsByLectureId = async (lectureId) => {
  return await httpClient.get(`${API.GET_ASSIGNMENTS_BY_LECTURE}/${lectureId}`, {
    headers: {
      Authorization: "Bearer " + keycloak.token,
    },
  });
};