import React, { useState } from "react";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("client_id", "skillhub_app");  // Điền client ID từ Keycloak
    params.append("username", username);
    params.append("password", password);
    params.append("client_secret", "vwPi2qrYKPd7nOe9ErW8JqBWCikz5DfZ");
    params.append("scope", "openid");

    try {
      const response = await axios.post(
        "http://localhost:8180/realms/vmaudev/protocol/openid-connect/token",  // Điền URL của Keycloak
        params
      );
      const { access_token, refresh_token } = response.data;
    
      // Lưu token vào localStorage
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      console.log("Access Token:", access_token);
      console.log("Refresh Token:", refresh_token);
    
      console.log("Navigating to home page");
      // Chuyển hướng đến trang chính sau khi đăng nhập thành công
      navigate("/");
    } catch (err) {
      setError("Invalid username or password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h4" mb={3}>
        Login
      </Typography>
      <form onSubmit={handleLogin}>
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
        {error && <Typography color="error" mt={2}>{error}</Typography>}
      </form>
    </Box>
  );
}
