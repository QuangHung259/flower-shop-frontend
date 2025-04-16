"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";

// Lấy API URL từ biến môi trường
const API = process.env.NEXT_PUBLIC_API_URL;

export default function AuthModal({ open, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAuth = async () => {
    setError("");

    try {
      const endpoint = isLogin
        ? `${API}/api/users/login`
        : `${API}/api/users/register`;

      const body = JSON.stringify(
        isLogin ? { email, password } : { name, email, password }
      );

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra!");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("storage"));
      onClose();

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isLogin ? "Đăng nhập" : "Đăng ký"}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 300,
            padding: 2,
          }}
        >
          {!isLogin && (
            <TextField
              label="Họ và tên"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Mật khẩu"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAuth}
          >
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </Button>
          <Button color="secondary" onClick={() => setIsLogin(!isLogin)}>
            {isLogin
              ? "Chưa có tài khoản? Đăng ký ngay!"
              : "Đã có tài khoản? Đăng nhập!"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
