import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import keycloak from "../keycloak";

// Lấy danh sách các bài giảng theo khóa học
export const getLecturesByCourseId = async (courseId) => {
  return await httpClient.get(`${API.GET_LECTURES_BY_COURSE}/${courseId}`, {
    headers: {
      Authorization: "Bearer " + keycloak.token,
    },
  });
};

// Thêm bài giảng mới
export const createLecture = async (formData) => {
  return await httpClient.post(API.CREATE_LECTURE, formData, {
    headers: {
      Authorization: "Bearer " + keycloak.token,
      "Content-Type": "multipart/form-data",
    },
  });
};