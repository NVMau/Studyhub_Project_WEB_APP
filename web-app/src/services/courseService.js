import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";

// Hàm tạo khóa học
export const createCourse = async (courseData) => {
  return await httpClient.post(API.CREATE_COURSE, courseData, {
    headers: {
      "Content-Type": "multipart/form-data",  // Chỉ cần giữ lại headers cần thiết khác
    },
  });
};

// Hàm lấy danh sách giáo viên
export const getTeachers = async () => {
  return await httpClient.get(API.GET_TEACHERS);
};

// Hàm lấy danh sách tất cả khóa học
export const getAllCourses = async () => {
  return await httpClient.get(API.GET_ALLCOURSE);
};

// Hàm tìm kiếm khóa học theo từ khóa, tên giáo viên, giá
export const searchCourses = async (keyword, teacherName, minPrice, maxPrice) => {
  const params = new URLSearchParams();
  if (keyword) params.append("keyword", keyword);
  if (teacherName) params.append("teacherName", teacherName);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);

  return await httpClient.get(`${API.GET_ALLCOURSE}?${params.toString()}`);
};