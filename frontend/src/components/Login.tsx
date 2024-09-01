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
  InputAdornment,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useSignIn from "react-auth-kit/hooks/useSignIn";

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate(); // Initialize useNavigate hook
  const signIn = useSignIn();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
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
        "https://motto-ai-be.vercel.app/api/login/",
        {
          email,
          password,
        }
      );

      // Handle successful login
      console.log("Login successful:", response.data);
      // Sign in the user and store token
      signIn({
        auth: {
          token: response.data.access,
          type: "Bearer",
        },
        userState: {
          email: email,
          uid: 123456,
        },
      });
      navigate("/"); // Redirect to the home page
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login error:", err);
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <img
            src="logomotto.jpeg"
            alt="App Logo"
            width="40"
          />
          <Typography variant="h4" component="h1" gutterBottom>
            MottO.AI
          </Typography>
          <Typography>I Am Here For You</Typography>
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        {error && (
          <Box mt={2} width="100%">
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        <Box mt={2}>
          <Typography variant="body2">
            New user?{" "}
            <Link href="/register" underline="hover">
              Create an Account
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
