import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Scene from "./Scene";
import { getTeachers, createCourse } from "../services/courseService"; // Thay thế bằng courseService đã cấu hình sẵn

export default function CreateCourse() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [teacherId, setTeacherId] = useState(""); // Lưu profileId thay vì userId
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // Để hiển thị ảnh xem trước
  const [teachers, setTeachers] = useState([]); // Lưu danh sách giáo viên
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState("info");
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const handleCloseSnackBar = () => {
    setSnackBarOpen(false);
  };

  // Lấy danh sách giáo viên khi component được mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getTeachers(); // Sử dụng service để lấy danh sách giáo viên
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers", error);
      }
    };

    fetchTeachers();
  }, []);

  // Hiển thị ảnh xem trước khi người dùng chọn file ảnh
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Hiển thị ảnh xem trước
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(objectUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("tags", tags.split(","));
    formData.append("teacherId", teacherId); // profileId của giáo viên được chọn
    formData.append("file", file);

    try {
      await createCourse(formData); // Gọi API tạo khóa học
      setSnackSeverity("success");
      setSnackBarMessage("Course created successfully!");
      setSnackBarOpen(true);
    } catch (error) {
      setSnackSeverity("error");
      setSnackBarMessage(
        error.response?.data?.message || "Failed to create course"
      );
      setSnackBarOpen(true);
    }
  };

  return (
    <Scene>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: 600,
          margin: "0 auto",
        }}
        onSubmit={handleSubmit}
      >
        <Typography variant="h4">Create a New Course</Typography>

        <TextField
          label="Course Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
          multiline
          rows={4}
        />

        <TextField
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          required
          type="number"
        />

        <TextField
          label="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          fullWidth
        />

        <FormControl fullWidth required>
          <InputLabel id="teacher-select-label">Select Teacher</InputLabel>
          <Select
            labelId="teacher-select-label"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)} // Cập nhật teacherId khi chọn giáo viên
            label="Select Teacher"
          >
            {teachers.map((teacher) => (
              <MenuItem key={teacher.profileId} value={teacher.profileId}>
                {teacher.firstName} {teacher.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" component="label" fullWidth>
          Upload Image
          <input
            type="file"
            hidden
            onChange={handleFileChange} // Cập nhật file và hiển thị ảnh xem trước
          />
        </Button>

        {previewImage && (
          <Box
            component="img"
            src={previewImage}
            alt="Preview"
            sx={{ width: "100%", height: "auto", marginTop: "20px" }}
          />
        )}

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Create Course
        </Button>
      </Box>

      <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackSeverity}
          variant="filled"
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </Scene>
  );
}
