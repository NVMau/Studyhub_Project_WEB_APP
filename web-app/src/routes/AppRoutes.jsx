import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Registration from "../pages/Registration";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import Courses from "../pages/Course";
import CreateCourse from "../pages/CreateCourse";
import Profile from "../pages/Profile";
import LecturePage from "../pages/LecturePage";
import CoursesTeacher from "../pages/CoursesTeacher";
import CoursesStudent from "../pages/CoursesStudent";
import LectureStudent from "../pages/LectureStudent";
import LectureTeacher from "../pages/LectureTeacher";






const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/createCourses" element={<CreateCourse />} />
        <Route path="/profile" element={<Profile />} />



        <Route path="/lectures/:courseId" element={<LecturePage />} />{/* Add route for LecturePage */}
        <Route path="/courses-teacher" element={<CoursesTeacher />} />
        <Route path="/courses-student" element={<CoursesStudent />} />
        <Route path="/lectures-student/:courseId" element={<LectureStudent />} />{/* Add route for LecturePage */}
        <Route path="/lectures-teacher/:courseId" element={<LectureTeacher />} />



        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
