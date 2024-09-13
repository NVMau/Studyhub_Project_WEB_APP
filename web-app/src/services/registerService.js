import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import keycloak from "../keycloak";

// Hàm đăng ký khóa học
export const registerCourse = async (data) => {
  return await httpClient.post(API.REGISTER_COURSE, data, {
    headers: {
      Authorization: "Bearer " + keycloak.token,
      "Content-Type": "application/json",
    },
  });
};
