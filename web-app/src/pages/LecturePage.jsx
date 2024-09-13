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
  const [previewVideo, setPreviewVideo] = useState([]); // Hiển thị video preview
  const userRoles = keycloak.tokenParsed?.realm_access?.roles || []; // Get user roles

  useEffect(() => {
    const fetchLectures = async () => {
      const response = await getLecturesByCourseId(courseId);
      setLectures(response.data);
    };
    fetchLectures();
  }, [courseId]);

  const handleVideoChange = (e) => {
    const selectedVideos = Array.from(e.target.files); // Chuyển filelist thành array
    setNewLecture({ ...newLecture, videos: selectedVideos });

    // Hiển thị preview của tất cả các video đã chọn
    const previewUrls = selectedVideos.map((video) =>
      URL.createObjectURL(video)
    );
    setPreviewVideo(previewUrls);
  };

  const handleCreateLecture = async () => {
    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("title", newLecture.title);
    formData.append("content", newLecture.content);
    formData.append("file", newLecture.file);

    // Kiểm tra và gửi dữ liệu video đúng cách
    newLecture.videos.forEach((video, index) => {
      formData.append(`videos`, video); // Không cần index, vì Spring sẽ nhận diện "videos" là danh sách
    });
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      console.log("FormData: ", formData);
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
          sx={{ textAlign: "center",
            fontWeight: 'bold'
           }} // Canh giữa chữ
        >
          DANH SÁCH BÀI GIẢNG
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
                  boxShadow: 3,
                  borderRadius: 2,
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
                        {`${lecture.fileUrl.split("/").pop()}`}{" "}
                        {/* Lấy tên file từ URL */}
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
                          {" "}
                          {/* Thêm khoảng cách giữa các video */}
                          <Typography variant="body1" sx={{ marginBottom: 2 }}>
                            {`Video ${index + 1}:`}
                          </Typography>
                          <CardMedia
                            component="video"
                            height="300" // Điều chỉnh chiều cao video
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

        {/* Render form for creating a new lecture */}
        {userRoles.includes("ROLE_ADMIN") ||
        userRoles.includes("ROLE_TEACHER") ? (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Thêm bài giảng mới
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Nhập tên bài giảng"
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
                  label="Nhập nội dung chính"
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

              {/* Hiển thị preview PDF */}
              {newLecture.file &&
                newLecture.file.type === "application/pdf" && (
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      Xem trước tài liệu PDF:
                    </Typography>
                    <iframe
                      src={URL.createObjectURL(newLecture.file)}
                      width="100%"
                      height="500px"
                    ></iframe>
                  </Grid>
                )}
              <Grid item xs={12}>
                <Button variant="contained" component="label" fullWidth>
                  Chọn Video bài giảng (mp4)
                  <input
                    type="file"
                    accept="video/mp4"
                    multiple // Cho phép chọn nhiều video
                    hidden
                    onChange={handleVideoChange} // Hàm xử lý sẽ cần điều chỉnh để nhận nhiều file
                  />
                </Button>
              </Grid>
              {/* Hiển thị preview cho tất cả các video đã chọn */}
              {previewVideo && previewVideo.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6">Xem trước video:</Typography>
                  {previewVideo.map((videoUrl, index) => (
                    <CardMedia
                      key={index}
                      component="video"
                      height="300"
                      controls
                      src={videoUrl}
                      sx={{ marginTop: 2 }}
                    />
                  ))}
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="warning"
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
