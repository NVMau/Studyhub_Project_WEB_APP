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
import keycloak from "../keycloak";
import {
  getLecturesByCourseId,
  createLecture,
} from "../services/lectureService";
import { useParams } from "react-router-dom";
import Scene from "./Scene";
import { createAssignment } from "../services/assignmentService";

export default function LecturePage() {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [newLecture, setNewLecture] = useState({
    title: "",
    content: "",
    file: null,
    videos: [],
  });
  const [previewVideo, setPreviewVideo] = useState([]);
  const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];
  const [lectureQuestions, setLectureQuestions] = useState({});
  const [assignmentCreated, setAssignmentCreated] = useState({});

  useEffect(() => {
    const fetchLectures = async () => {
      const response = await getLecturesByCourseId(courseId);
      setLectures(response.data);
      const initialQuestions = response.data.reduce((acc, lecture) => {
        acc[lecture.id] = [];
        return acc;
      }, {});
      setLectureQuestions(initialQuestions);
    };
    fetchLectures();
  }, [courseId]);

  const handleVideoChange = (e) => {
    const selectedVideos = Array.from(e.target.files);
    setNewLecture({ ...newLecture, videos: selectedVideos });
    const previewUrls = selectedVideos.map(video => URL.createObjectURL(video));
    setPreviewVideo(previewUrls);
  };

  const handleCreateLecture = async () => {
    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("title", newLecture.title);
    formData.append("content", newLecture.content);
    formData.append("file", newLecture.file);
    newLecture.videos.forEach(video => formData.append("videos", video));
    try {
      await createLecture(formData);
      alert("Bài giảng đã được thêm thành công!");
      const response = await getLecturesByCourseId(courseId);
      setLectures(response.data);
    } catch (error) {
      console.error("Error creating lecture:", error);
      alert("Lỗi khi thêm bài giảng.");
    }
  };

  const handleCreateAssignment = async (lectureId) => {
    try {
      const payload = {
        lectureId,
        questions: lectureQuestions[lectureId],
      };
      await createAssignment(payload);
      alert("Bài tập đã được thêm thành công!");
      setAssignmentCreated(prev => ({ ...prev, [lectureId]: true }));
    } catch (error) {
      console.error("Lỗi khi thêm bài tập:", error);
      alert("Lỗi khi thêm bài tập.");
    }
  };

  const handleQuestionTextChange = (lectureId, index, value) => {
    setLectureQuestions(prev => ({
      ...prev,
      [lectureId]: prev[lectureId].map((question, i) =>
        i === index ? { ...question, questionText: value } : question
      ),
    }));
  };

  const handleOptionChange = (lectureId, questionIndex, optionIndex, value) => {
    setLectureQuestions(prev => ({
      ...prev,
      [lectureId]: prev[lectureId].map((question, i) =>
        i === questionIndex
          ? { ...question, options: question.options.map((option, j) =>
              j === optionIndex ? value : option
            ) }
          : question
      ),
    }));
  };

  const handleCorrectAnswerChange = (lectureId, questionIndex, value) => {
    setLectureQuestions(prev => ({
      ...prev,
      [lectureId]: prev[lectureId].map((question, i) =>
        i === questionIndex ? { ...question, correctAnswer: value } : question
      ),
    }));
  };

  const addNewQuestion = (lectureId) => {
    setLectureQuestions(prev => ({
      ...prev,
      [lectureId]: [
        ...prev[lectureId],
        { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
      ],
    }));
  };

  return (
    <Scene>
      <Box sx={{ padding: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold" }}
        >
          DANH SÁCH BÀI GIẢNG
        </Typography>

        <Grid container spacing={3}>
          {lectures.map((lecture) => (
            <Grid item xs={12} md={12} key={lecture.id}>
              <Card
                sx={{
                  height: "100%",
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

                  {userRoles.includes("ROLE_ADMIN") ||
                  userRoles.includes("ROLE_TEACHER") ? (
                    assignmentCreated[lecture.id] ? (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="h5" gutterBottom>
                          Câu hỏi trong bài tập
                        </Typography>
                        {lectureQuestions[lecture.id].map((question, index) => (
                          <Box key={index} sx={{ mb: 3 }}>
                            <TextField
                              label="Câu hỏi"
                              value={question.questionText}
                              fullWidth
                              sx={{ mb: 2 }}
                            />
                            {question.options.map((option, optionIndex) => (
                              <TextField
                                key={optionIndex}
                                label={`Lựa chọn ${optionIndex + 1}`}
                                value={option}
                                fullWidth
                                sx={{ mb: 2 }}
                              />
                            ))}
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <>
                        <Button
                          variant="outlined"
                          onClick={() => addNewQuestion(lecture.id)}
                          sx={{ mb: 2 }}
                        >
                          Thêm câu hỏi
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 2 }}
                          fullWidth
                          onClick={() => handleCreateAssignment(lecture.id)}
                        >
                          Thêm bài tập
                        </Button>
                      </>
                    )
                  ) : null}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Render form for creating a new lecture */}
        {userRoles.includes("ROLE_ADMIN") ||
        userRoles.includes("ROLE_TEACHER") ? (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
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
