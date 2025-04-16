//src/app/auth/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import InputField from "@/components/ui/InputField";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const router = useRouter();

  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = "Vui lòng nhập email.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      errors.email = "Email không hợp lệ.";
    }

    if (!password) {
      errors.password = "Vui lòng nhập mật khẩu.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    setError("");
    if (!validateForm()) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", data.user.email);
      window.dispatchEvent(new Event("storage"));

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url("/images/login.jpg")',
        backgroundSize: "cover",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            color="#546e7a"
          >
            Đăng Nhập
          </Typography>

          {error && (
            <Typography color="error" textAlign="center" mt={1}>
              {error}
            </Typography>
          )}

          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <InputField
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box textAlign="right" mt={1}>
            <MuiLink
              underline="hover"
              color="secondary"
              fontSize="0.9rem"
              onClick={() => router.push("/auth/forgot-password")}
              sx={{ cursor: "pointer" }}
            >
              Quên mật khẩu?
            </MuiLink>
          </Box>

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleLogin}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Đăng nhập
          </Button>

          <Typography textAlign="center" mt={3}>
            Bạn chưa có tài khoản?{" "}
            <MuiLink
              color="secondary"
              fontWeight="bold"
              underline="hover"
              sx={{ cursor: "pointer" }}
              onClick={() => router.push("/auth/register")}
            >
              Đăng ký ngay
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
