import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  Link,
} from "@mui/material";
import keycloak from "../keycloak"; // Keycloak to get user roles
import {
  getLecturesByCourseId,
  createLecture,
} from "../services/lectureService"; // API service
import { useParams } from "react-router-dom"; // Import useParams để lấy courseId
import Scene from "./Scene";
import { createAssignment } from "../services/assignmentService";

export default function LecturePage() {
  const { courseId } = useParams(); // Lấy courseId từ URL
  const [lectures, setLectures] = useState([]);
  const userRoles = keycloak.tokenParsed?.realm_access?.roles || []; // Get user roles

  // Trạng thái để theo dõi câu hỏi của từng bài giảng

  useEffect(() => {
    const fetchLectures = async () => {
      const response = await getLecturesByCourseId(courseId);
      setLectures(response.data);
      // Khởi tạo trạng thái câu hỏi cho mỗi bài giảng
    };
    fetchLectures();
  }, [courseId]);
  return (
    <Scene>
      <Box sx={{ padding: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold" }} // Canh giữa chữ
        >
          DANH SÁCH BÀI GIẢNG
        </Typography>

        <Grid container spacing={3}>
          {lectures.map((lecture) => (
            <Grid item xs={12} md={12} key={lecture.id}>
              <Card
                sx={{
                  height: "100%", // Chiều cao của card chiếm toàn bộ khung
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  margin: "0 auto",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5">{lecture.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {lecture.content}
                  </Typography>

                  {/* Hiển thị file PDF nếu có */}
                  {lecture.fileUrl && (
                    <Box sx={{ marginTop: 2 }}>
                      <Typography variant="h6">Tài liệu:</Typography>
                      <Link
                        href={lecture.fileUrl}
                        target="_blank"
                        rel="noopener"
                      >
                        {lecture.fileUrl.split("/").pop()}
                      </Link>
                    </Box>
                  )}

                  {/* Hiển thị nhiều video nếu có */}
                  {lecture.videoUrls && lecture.videoUrls.length > 0 && (
                    <Box sx={{ marginTop: 2 }}>
                      <Typography variant="h6">Video về bài giảng:</Typography>
                      {lecture.videoUrls.map((videoUrl, index) => (
                        <Box
                          key={index}
                          sx={{ marginBottom: 4, marginLeft: 4 }}
                        >
                          <Typography variant="body1" sx={{ marginBottom: 2 }}>
                            {`Video ${index + 1}:`}
                          </Typography>
                          <CardMedia
                            component="video"
                            height="300"
                            controls
                            src={videoUrl}
                            sx={{ marginTop: 2 }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

       
      </Box>
    </Scene>
  );
}
