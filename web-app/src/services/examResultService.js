import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import keycloak from "../keycloak";

// Lấy bài tập theo lectureId
// API để lấy danh sách bài tập theo bài giảng
export const getAssignmentsByLectureId = async (lectureId) => {
    return await httpClient.get(`${API.GET_ASSIGNMENTS_BY_LECTURE}/${lectureId}`, {
      headers: {
        Authorization: "Bearer " + keycloak.token,
      },
    });
  };

// Gửi kết quả bài thi
export const submitExamResult = async (assignmentId, userId, resultPayload) => {
  return await httpClient.post(`${API.SUBMIT_EXAM_RESULT}/${assignmentId}/user/${userId}`, resultPayload, {
    headers: {
      Authorization: "Bearer " + keycloak.token,
      "Content-Type": "application/json",
    },
  });
};

export const getExamResultByLectureId = async (assignmentId, userId) => {
    return await httpClient.get(`${API.GET_EXAMRESULT_BY_LECTURE}/${assignmentId}/user/${userId}`, {
        headers: {
          Authorization: "Bearer " + keycloak.token,
        },
      });
  };
  
