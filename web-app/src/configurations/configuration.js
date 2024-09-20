export const CONFIG = {
  API_GATEWAY: "http://localhost:9000",
};

export const API = {

  //API cho User
  REGISTRATION: "/api/profiles/register",
  MY_PROFILE: "/api/profiles/my-profile",
  USERREGISTERCOURSE: "/api/profiles/courses",
  

  GET_ALL_USERS:"/api/profiles/all-profiles",
  UPDATE_USER: "/api/profiles/user",

  DELETE_USER: "/api/profiles/delete-user",



  //API cho khóa học 
  CREATE_COURSE: "/api/courses",
  GET_TEACHERS_COURSES: "/api/profiles/teacher-courses",
  GET_TEACHERS: "/api/profiles/teachers",
  GET_ALLCOURSE: "/api/courses/search",
  REGISTER_COURSE: "/api/enrollments",
  DELETE_COURSE:"/api/courses",
  UPDATE_COURSE: "/api/courses",

  //API bài giảng 
  GET_LECTURES_BY_COURSE: "/api/lectures/course",  // API lấy bài giảng

  CREATE_LECTURE: "/api/lectures",  // API thêm bài giảng


  //APi Cho bài tập 
  CREATE_ASSIGNMENT: "/api/assignments",

  GET_ASSIGNMENTS_BY_LECTURE: "/api/assignments/lecture",


  SUBMIT_EXAM_RESULT: "/api/exam-results",
  GET_EXAMRESULT_BY_LECTURE: "/api/exam-results/assignment",


  //Payment 
  PAYMENT: "/api/profiles/submitOrder"

  
};

export const KEYCLOAK_CONFIG = {
  url: "http://localhost:8180",
  realm: "vmaudev",
  clientId: "skillhub_webapp",
};
