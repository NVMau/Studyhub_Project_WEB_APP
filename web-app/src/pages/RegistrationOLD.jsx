import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Snackbar,
    Alert,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
  } from "@mui/material";
  
  import { useState } from "react";
  import { register } from "../services/userService";
  
  export default function Registration() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("ROLE_STUDENT"); // Mặc định là Student
    const [snackSeverity, setSnackSeverity] = useState("info");
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
  
    const handleCloseSnackBar = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
  
      setSnackBarOpen(false);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      try {
        const data = {
          username: username,
          password: password,
          firstName: firstname,
          lastName: lastname,
          email: email,
          roles: [role], // Gửi role vào payload
        };
  
        let response = await register(data);
  
        console.log("Response body:", response.data);
        setSnackSeverity("success");
        setSnackBarMessage("Registration completed successfully!");
        setSnackBarOpen(true);
      } catch (error) {
        const errorResponse = error.response?.data || "An error occurred";
        setSnackSeverity("error");
        setSnackBarMessage(errorResponse.message);
        setSnackBarOpen(true);
      }
    };
  
    return (
      <>
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
            sx={{ width: "100%" }}
          >
            {snackBarMessage}
          </Alert>
        </Snackbar>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bgcolor={"#f0f2f5"}
        >
          <Card
            sx={{
              minWidth: 400,
              maxWidth: 500,
              boxShadow: 3,
              borderRadius: 3,
              padding: 4,
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h1" gutterBottom>
                Welcome, let's create an account
              </Typography>
              <Box
                component="form"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                width="100%"
                onSubmit={handleSubmit}
              >
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Firstname"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
                <TextField
                  label="Lastname"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
                
                {/* Chọn Role */}
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value="ROLE_STUDENT">Student</MenuItem>
                    <MenuItem value="ROLE_TEACHER">Teacher</MenuItem>
                  </Select>
                </FormControl>
  
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSubmit}
                  fullWidth
                  sx={{
                    mt: "15px",
                    mb: "25px",
                  }}
                >
                  Register
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </>
    );
  }
  