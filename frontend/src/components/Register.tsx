import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Link,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://motto-ai-be.vercel.app/api/register",
        {
          username,
          email,
          password,
        }
      );

      // Handle successful registration
      console.log("Registration successful:", response.data);
      navigate("/login"); // Redirect to the login page after successful registration
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
          padding: 2,
          borderRadius: "8px",
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Username"
              type="text"
              variant="outlined"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </Box>
          <Box mb={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel required htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                fullWidth
                label="Password"
                value={password}
                onChange={handlePasswordChange}
                required
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        {error && (
          <Box mt={2} width="100%">
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        <Box mt={2}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link href="/login" underline="hover">
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
