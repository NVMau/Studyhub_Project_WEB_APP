import * as React from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { useNavigate } from "react-router-dom";
import useUserRoles from "../services/useUserRoles"; // Import custom hook



function SideMenu() {
  const navigate = useNavigate(); // Sử dụng useNavigate để lấy hàm điều hướng
  const userRoles = useUserRoles(); // Lấy userRoles từ custom hook

  return (
    <>
      <Toolbar />
      <List>
        <ListItem key={"home"} disablePadding>
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Trang chủ "}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
            />
          </ListItemButton>
        </ListItem>
        {userRoles.includes("ROLE_STUDENT") ? (
        <ListItem key={"courses-student"} disablePadding>
            <ListItemButton onClick={() => navigate("/courses-student")}>
              <ListItemIcon>
                <LocalLibraryIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Khóa học đã đăng kí"}
                primaryTypographyProps={{ style: { fontWeight: "bold" } }}
              />
            </ListItemButton>
          </ListItem>
          ) : null}



        {/* Hiển thị mục khóa học chỉ khi người dùng có ROLE_ADMIN hoặc ROLE_TEACHER */}
        {userRoles.includes("ROLE_ADMIN") || userRoles.includes("ROLE_TEACHER") ? (
          <ListItem key={"createCourses"} disablePadding>
            <ListItemButton onClick={() => navigate("/createCourses")}>
              <ListItemIcon>
                <LocalLibraryIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Tạo khóa học"}
                primaryTypographyProps={{ style: { fontWeight: "bold" } }}
              />
            </ListItemButton>
          </ListItem>
        ) : null}

        {/* Hiển thị mục khóa học chỉ khi người dùng có ROLE_ADMIN hoặc ROLE_TEACHER */}
        {userRoles.includes("ROLE_ADMIN") || userRoles.includes("ROLE_TEACHER") ? (
          <ListItem key={"courses-teacher"} disablePadding>
            <ListItemButton onClick={() => navigate("/courses-teacher")}>
              <ListItemIcon>
                <LocalLibraryIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Chỉnh sửa khóa học"}
                primaryTypographyProps={{ style: { fontWeight: "bold" } }}
              />
            </ListItemButton>
          </ListItem>
        ) : null}


        {/* Khóa học Item */}
        <ListItem key={"baitap"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
               {/* Khóa học icon */}
               <AssignmentTurnedInIcon/>
            </ListItemIcon>
            <ListItemText
              primary={"Bài Tập"}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
            />
          </ListItemButton>
        </ListItem>



        {/* Khóa học Item */}
        <ListItem key={"chat"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
               {/* Khóa học icon */}
               <ChatIcon/>
            </ListItemIcon>
            <ListItemText
              primary={"Chat"}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
            />
          </ListItemButton>
        </ListItem>
        

         {/* Khóa học Item */}
         <ListItem key={"thongke"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
               {/* Khóa học icon */}
               <AssessmentIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Thống Kê"}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
            />
          </ListItemButton>
        </ListItem>


        <ListItem key={"profile"} disablePadding>
            <ListItemButton onClick={() => navigate("/profile")}>
              <ListItemIcon>
                <LocalLibraryIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Profile"}
                primaryTypographyProps={{ style: { fontWeight: "bold" } }}
              />
            </ListItemButton>
          </ListItem>




       
      </List>
      <Divider />
    </>
  );
}

export default SideMenu;