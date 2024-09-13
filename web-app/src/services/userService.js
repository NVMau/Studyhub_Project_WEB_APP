import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import keycloak from "../keycloak";

export const register = async (data) => {
  return await httpClient.post(API.REGISTRATION, data);
};

export const getMyProfile = async () => {
  return await httpClient.get(API.MY_PROFILE, {
    headers : {
      Authorization: "Bearer " + keycloak.token
    }
  })
}
// API to get registered courses for students
export const getRegisteredCourses = async () => {
  return await httpClient.get(API.USERREGISTERCOURSE, {
    headers: {
      Authorization: "Bearer " + keycloak.token,
    },
  });
};

// API to get courses that the teacher is teaching
export const getTeachingCourses = async () => {
  return await httpClient.get(API.GET_TEACHERS_COURSES, {
    headers: {
      Authorization: "Bearer " + keycloak.token,
    },
  });
};