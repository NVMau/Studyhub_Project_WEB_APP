import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  Link,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import keycloak from "../keycloak"; // Keycloak to get user roles
import { getLecturesByCourseId } from "../services/lectureService"; // API service
import { useParams } from "react-router-dom"; // Import useParams để lấy courseId
import Scene from "./Scene";
import { getMyProfile } from "../services/userService";

import {
  getAssignmentsByLectureId,
  submitExamResult,
  getExamResultByLectureId, // API để lấy kết quả bài thi
} from "../services/examResultService"; // Service để lấy bài tập và gửi kết quả

export default function LecturePage() {
  const { courseId } = useParams(); // Lấy courseId từ URL
  const [lectures, setLectures] = useState([]);
  const [assignment, setAssignment] = useState(null); // Lưu bài tập hiện tại
  const [examResult, setExamResult] = useState(null); // Lưu kết quả bài thi nếu đã làm
  const [userAnswers, setUserAnswers] = useState({}); // Trạng thái để lưu câu trả lời của người dùng
  const [loadingAssignment, setLoadingAssignment] = useState(false); // Để kiểm tra trạng thái load bài tập
  const [selectedLectureId, setSelectedLectureId] = useState(null); // Theo dõi bài giảng được chọn để làm bài
  const [profile, setProfile] = useState({});

  const getProfile = async () => {
    try {
      const response = await getMyProfile();
      const data = response.data;

      console.log("Response data:", data); // In ra dữ liệu response

      setProfile(data);
    } catch (error) {
      const errorResponse = error.response?.data;
      console.log("errorResponse data:", errorResponse);
    }
  };

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await getLecturesByCourseId(courseId);
        getProfile();
        setLectures(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài giảng:", error);
      }
    };
    fetchLectures();
  }, [courseId]);

  // Xử lý khi học sinh chọn câu trả lời
  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };

  // Gửi kết quả bài tập
  const handleSubmitExam = async () => {
    try {
      const resultPayload = {
        userAnswers: Object.values(userAnswers),
      };
      // Gửi câu trả lời đến backend
      await submitExamResult(assignment.id, profile.profileId, resultPayload);
      alert("Bài thi đã được gửi thành công!");
    } catch (error) {
      console.error("Lỗi khi gửi bài thi:", error);
      alert("Lỗi khi gửi bài thi.");
    }
  };

  // Lấy bài tập cho từng bài giảng khi học sinh muốn làm bài
  const handleFetchAssignment = async (lectureId) => {
    setLoadingAssignment(true); // Bắt đầu load
    setSelectedLectureId(lectureId); // Đặt bài giảng được chọn

    if (!profile?.profileId) {
      console.error("Profile ID is not ready yet.");
      setLoadingAssignment(false);
      return;
    }

    console.log(
      `Fetching assignment for lecture ID: ${lectureId}, Profile ID: ${profile?.profileId}`
    );

    try {
      // Đầu tiên, lấy assignment trước dựa trên lectureId
      const assignmentResponse = await getAssignmentsByLectureId(lectureId);
      if (assignmentResponse.data && assignmentResponse.data.length > 0) {
        const assignment = assignmentResponse.data[0]; // Giả sử bạn chỉ có một assignment
        setAssignment(assignment);

        console.log("Fetching exam result for assignment ID:", assignment.id);

        // Sau đó, gọi API kết quả bài thi bằng assignmentId
        const examResultResponse = await getExamResultByLectureId(
          assignment.id, // Đây là assignmentId, không phải lectureId
          profile.profileId
        );

        if (examResultResponse?.data) {
          console.log(
            "Exam result data available for assignment:",
            assignment.id
          );
          setExamResult(examResultResponse.data); // Đặt kết quả bài thi
          setAssignment(null); // Nếu đã làm bài thi, không cần hiển thị assignment
        } else {
          console.log("No exam result found, assignment is available");
          setExamResult(null); // Nếu chưa có kết quả thì để người dùng làm bài
        }
      } else {
        setAssignment(null);
        console.log("No assignment found for this lecture.");
        alert("Không có bài tập nào cho bài giảng này.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bài tập hoặc kết quả:", error);
      setAssignment(null);
    } finally {
      setLoadingAssignment(false); // Kết thúc load
    }
  };

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

{examResult && selectedLectureId === lecture.id ? (
  <Box sx={{ mt: 5 }}>
    <Typography variant="h5" gutterBottom>
      Điểm của bạn: {examResult.score}
    </Typography>
    {examResult.questionResults.map((result, index) => (
      <Box
        key={index}
        sx={{
          mb: 3,
          p: 2,
          border: '1px solid',
          borderColor: result.correct ? 'green' : 'red',
          backgroundColor: result.correct ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
          borderRadius: '5px',
        }}
      >
        <Typography variant="body1" fontWeight="bold">
          Câu {index + 1}: {result.questionText}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: result.correct ? 'green' : 'red', fontWeight: 'bold' }}
        >
          Câu trả lời của bạn: {result.userAnswer} {result.correct ? "(Đúng)" : "(Sai)"}
        </Typography>
        <Typography variant="body2">
          Đáp án đúng: {result.correctAnswer}
        </Typography>
      </Box>
    ))}
  </Box>
) : (
                    <>
                      {/* Hiển thị nút làm bài tập nếu chưa làm */}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleFetchAssignment(lecture.id)}
                        sx={{ mt: 2 }}
                      >
                        Xem bài tập
                      </Button>

                      {/* Hiển thị loading khi đang lấy bài tập */}
                      {loadingAssignment &&
                        selectedLectureId === lecture.id && (
                          <Typography
                            variant="body1"
                            sx={{ textAlign: "center", mt: 3 }}
                          >
                            Đang tải bài tập...
                          </Typography>
                        )}

                      {/* Hiển thị bài tập nếu chưa làm */}
                      {assignment &&
                      selectedLectureId === lecture.id &&
                      assignment.questions &&
                      assignment.questions.length > 0 ? (
                        <Box sx={{ mt: 5 }}>
                          <Typography variant="h5" gutterBottom>
                            {assignment.title || "Bài tập không có tiêu đề"}
                          </Typography>
                          {assignment.questions.map((question, index) => (
                            <Box key={index} sx={{ mb: 3 }}>
                              <Typography variant="body1">
                                Câu {index + 1}: {question.questionText}
                              </Typography>
                              <RadioGroup
                                name={`question-${index}`}
                                value={userAnswers[index] || ""}
                                onChange={(e) =>
                                  handleAnswerChange(index, e.target.value)
                                }
                              >
                                {question.options.map((option, optionIndex) => (
                                  <FormControlLabel
                                    key={optionIndex}
                                    value={option}
                                    control={<Radio />}
                                    label={option}
                                  />
                                ))}
                              </RadioGroup>
                            </Box>
                          ))}
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitExam}
                            sx={{ mt: 2 }}
                          >
                            Nộp bài
                          </Button>
                        </Box>
                      ) : (
                        !loadingAssignment &&
                        selectedLectureId === lecture.id && (
                          <Typography
                            variant="body1"
                            sx={{ mt: 3, textAlign: "center" }}
                          >
                            Không có bài tập nào được tìm thấy.
                          </Typography>
                        )
                      )}
                    </>
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
