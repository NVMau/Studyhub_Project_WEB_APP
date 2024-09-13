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

export default function LecturePage() {
  const { courseId } = useParams(); // Lấy courseId từ URL
  const [lectures, setLectures] = useState([]);
  const [newLecture, setNewLecture] = useState({
    title: "",
    content: "",
    file: null,
    videos: [],
  });
  const [previewVideo, setPreviewVideo] = useState(null); // Hiển thị video preview
  const userRoles = keycloak.tokenParsed?.realm_access?.roles || []; // Get user roles

  useEffect(() => {
    const fetchLectures = async () => {
      const response = await getLecturesByCourseId(courseId);
      setLectures(response.data);
    };
    fetchLectures();
  }, [courseId]);

  // Hiển thị video xem trước khi người dùng chọn file video
  const handleVideoChange = (e) => {
    const selectedVideo = e.target.files[0];
    setNewLecture({ ...newLecture, videos: [selectedVideo] });

    // Hiển thị video xem trước
    if (selectedVideo) {
      const objectUrl = URL.createObjectURL(selectedVideo);
      setPreviewVideo(objectUrl);
    }
  };

  const handleCreateLecture = async () => {
    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("title", newLecture.title);
    formData.append("content", newLecture.content);
    formData.append("file", newLecture.file);
    newLecture.videos.forEach((video, index) => {
      formData.append(`videos[${index}]`, video);
    });

    try {
      await createLecture(formData);
      alert("Bài giảng đã được thêm thành công!");
      const response = await getLecturesByCourseId(courseId);
      setLectures(response.data); // Refresh lectures list
    } catch (error) {
      console.error("Error creating lecture:", error);
      alert("Lỗi khi thêm bài giảng.");
    }
  };

  return (
    <Scene>
      <Box sx={{ padding: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center" }} // Canh giữa chữ
        >
          Danh sách bài giảng
        </Typography>

        <Grid container spacing={3}>
          {lectures.map((lecture) => (
            <Grid item xs={12} md={12} key={lecture.id}>
              {" "}
              {/* Điều chỉnh để ô bài giảng chiếm hết chiều ngang */}
              <Card
                sx={{
                  height: "100%", // Chiều cao của card chiếm toàn bộ khung
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  margin: "0 auto",
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1, // Giúp cardContent chiếm đủ chiều cao
                  }}
                >
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
                        Tải tài liệu PDF/Word
                      </Link>
                    </Box>
                  )}

                  {/* Hiển thị nhiều video nếu có */}
                  {lecture.videoUrls && lecture.videoUrls.length > 0 && (
                    <Box sx={{ marginTop: 2 }}>
                      <Typography variant="h6">Video bài giảng:</Typography>
                      {lecture.videoUrls.map((videoUrl, index) => (
                        <CardMedia
                          key={index}
                          component="video"
                          height="300" // Điều chỉnh chiều cao video
                          controls
                          src={videoUrl}
                          sx={{ marginTop: 2 }}
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Render form for creating a new lecture */}
        {userRoles.includes("ROLE_ADMIN") ||
        userRoles.includes("ROLE_TEACHER") ? (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" gutterBottom>
              Thêm bài giảng mới
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tiêu đề"
                  value={newLecture.title}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, title: e.target.value })
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nội dung"
                  value={newLecture.content}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, content: e.target.value })
                  }
                  fullWidth
                  required
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label" fullWidth>
                  Chọn file bài giảng (PDF/Word)
                  <input
                    type="file"
                    accept="application/pdf, application/msword"
                    hidden
                    onChange={(e) =>
                      setNewLecture({ ...newLecture, file: e.target.files[0] })
                    }
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label" fullWidth>
                  Chọn Video bài giảng (mp4)
                  <input
                    type="file"
                    accept="video/mp4"
                    hidden
                    onChange={handleVideoChange}
                  />
                </Button>
              </Grid>
              {previewVideo && (
                <Grid item xs={12}>
                  <Typography variant="h6">Video preview:</Typography>
                  <CardMedia
                    component="video"
                    height="300"
                    controls
                    src={previewVideo}
                    sx={{ marginTop: 2 }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateLecture}
                  fullWidth
                >
                  Thêm bài giảng
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : null}
      </Box>
    </Scene>
  );
}
