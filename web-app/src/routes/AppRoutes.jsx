import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Registration from "../pages/Registration";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import Courses from "../pages/Course";
import CreateCourse from "../pages/CreateCourse";
import Profile from "../pages/Profile";
import LecturePage from "../pages/LecturePage";




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



        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
