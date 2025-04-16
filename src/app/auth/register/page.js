//src/app/auth/register/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const router = useRouter();

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) errors.name = "Vui lòng nhập họ tên.";
    if (!email.trim()) {
      errors.email = "Vui lòng nhập email.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      errors.email = "Email không hợp lệ.";
    }

    if (!phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!/^\d{10,11}$/.test(phone)) {
      errors.phone = "Số điện thoại không hợp lệ.";
    }

    if (!password) {
      errors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      errors.password = "Mật khẩu phải từ 6 ký tự.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setError("");
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: name,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng ký thất bại");
        setLoading(false);
        return;
      }

      alert("Đăng ký thành công!");
      router.push("/auth/login");
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setError("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
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
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            color="#546e7a"
          >
            Đăng ký tài khoản
          </Typography>

          {error && (
            <Typography color="error" textAlign="center" mt={2}>
              {error}
            </Typography>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <TextField
              label="Họ và tên"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              label="Số điện thoại"
              variant="outlined"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!formErrors.password}
              helperText={formErrors.password}
            />

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Đăng ký"
              )}
            </Button>

            <Typography textAlign="center">
              Đã có tài khoản?{" "}
              <Button
                color="secondary"
                onClick={() => router.push("/auth/login")}
                sx={{ textTransform: "none" }}
              >
                Đăng nhập
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
