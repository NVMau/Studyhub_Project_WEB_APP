import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";

// Hàm đăng ký người dùng mới
// Hàm đăng ký người dùng mới
export const register = async (data) => {
  return await httpClient.post(API.REGISTRATION, data, {
    headers: {
      "Content-Type": "application/json",  // Xác định kiểu dữ liệu là JSON
    },
  });
};

// Hàm lấy profile của người dùng hiện tại
export const getMyProfile = async () => {
  return await httpClient.get(API.MY_PROFILE);
};

// Hàm lấy các khóa học mà sinh viên đã đăng ký
export const getRegisteredCourses = async () => {
  return await httpClient.get(API.USERREGISTERCOURSE);
};

// Hàm lấy các khóa học mà giáo viên đang dạy
export const getTeachingCourses = async () => {
  return await httpClient.get(API.GET_TEACHERS_COURSES);
};