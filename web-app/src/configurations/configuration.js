export const CONFIG = {
  API_GATEWAY: "http://localhost:9000",
};

export const API = {
  REGISTRATION: "/api/profiles/register",
  MY_PROFILE: "/api/profiles/my-profile",

  USERREGISTERCOURSE: "/api/profiles/courses",
  CREATE_COURSE: "/api/courses",
  GET_TEACHERS_COURSES: "/api/profiles/teacher-courses",
  GET_TEACHERS: "/api/profiles/teachers",
  GET_ALLCOURSE: "/api/courses/search",

  GET_LECTURES_BY_COURSE: "/api/lectures/course",  // API lấy bài giảng
  CREATE_LECTURE: "/api/lectures",  // API thêm bài giảng

  REGISTER_COURSE: "/api/enrollments",
};

export const KEYCLOACK_CONFIG = {
  url: "http://localhost:8180",
  realm: "vmaudev",
  clientId: "skillhub_webapp",
};
