import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import keycloak from "../keycloak";

export const createCourse = async (courseData) => {
  return await httpClient.post(API.CREATE_COURSE, courseData, {
    headers: {
      Authorization: "Bearer " + keycloak.token,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getTeachers = async () => {
  return await httpClient.get(API.GET_TEACHERS, {
    headers: {
      Authorization: "Bearer " + keycloak.token,
    },
  });
};

export const getAllCourses = async () => {
  return await httpClient.get(API.GET_ALLCOURSE, {
    headers: {
      Authorization: "Bearer " + keycloak.token,
    },
  });
};
export const searchCourses = async (keyword, teacherName, minPrice, maxPrice) => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (teacherName) params.append("teacherName", teacherName);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
  
    return await httpClient.get(`${API.GET_ALLCOURSE}?${params.toString()}`, {
      headers: {
        Authorization: "Bearer " + keycloak.token,
      },
    });
  };