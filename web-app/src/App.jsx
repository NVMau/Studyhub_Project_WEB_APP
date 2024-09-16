import { useEffect } from "react";
import { CssBaseline } from "@mui/material";
import AppRoutes from "./routes/AppRoutes";
import keycloak from "./keycloak"; // Nhập keycloak instance từ file keycloak của bạn

function App() {

  // Hàm để kiểm tra và cập nhật token khi ứng dụng khởi động
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token && refreshToken) {
      console.log("Token và refresh token có sẵn trong localStorage");
      // Nếu cần, bạn có thể làm mới token tại đây
      // Hoặc gán token vào keycloak instance
      keycloak.token = token;
      keycloak.refreshToken = refreshToken;
    } else {
      console.log("Chưa có token, yêu cầu người dùng đăng nhập lại");
      // Bạn có thể yêu cầu người dùng đăng nhập lại ở đây nếu không có token
    }
  }, []);

  return (
    <>
      <CssBaseline />
      <AppRoutes />
    </>
  );
}

export default App;
