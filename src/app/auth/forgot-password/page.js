//src/app/auth/forgot-password/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  InputAdornment,
  TextField,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedIcon from "@mui/icons-material/Verified";
import LockIcon from "@mui/icons-material/Lock";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();

  // Countdown logic
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else if (step === 2 && timer === 0) {
      setCanResend(true);
    }
  }, [step, timer]);

  const validateEmail = () => {
    if (!email) return "Vui lòng nhập email.";
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!emailRegex.test(email)) return "Email không hợp lệ.";
    return "";
  };

  const validateOTP = () => {
    if (!otp) return "Vui lòng nhập mã xác nhận.";
    if (otp !== "123456") return "Mã xác nhận không đúng (giả lập là 123456).";
    return "";
  };

  const validateNewPassword = () => {
    if (!newPassword) return "Vui lòng nhập mật khẩu mới.";
    if (newPassword.length < 6) return "Mật khẩu phải từ 6 ký tự.";
    return "";
  };

  const handleNext = () => {
    let error = "";

    if (step === 1) {
      error = validateEmail();
      if (!error) {
        alert("Mã xác nhận đã được gửi đến email (giả lập là 123456)");
        setStep(2);
        setTimer(60);
        setCanResend(false);
      }
    } else if (step === 2) {
      error = validateOTP();
      if (!error) setStep(3);
    } else if (step === 3) {
      error = validateNewPassword();
      if (!error) {
        alert("Mật khẩu đã được đặt lại thành công!");
        router.push("/auth/login");
      }
    }

    setErrors({ step: error });
  };

  const handleResendOTP = () => {
    alert("Mã xác nhận mới đã được gửi! (giả lập là 123456)");
    setOtp("");
    setTimer(60);
    setCanResend(false);
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
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            color="#546e7a"
            mb={2}
          >
            {step === 1 && "Quên mật khẩu"}
            {step === 2 && "Xác nhận mã OTP"}
            {step === 3 && "Đặt lại mật khẩu"}
          </Typography>

          {errors.step && (
            <Typography color="error" textAlign="center" mb={2}>
              {errors.step}
            </Typography>
          )}

          {step === 1 && (
            <TextField
              label="Nhập email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#ec407a" }} />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {step === 2 && (
            <>
              <TextField
                label="Nhập mã xác nhận"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VerifiedIcon sx={{ color: "#ec407a" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="body2" mt={1}>
                {canResend ? (
                  <Button
                    color="secondary"
                    size="small"
                    onClick={handleResendOTP}
                  >
                    Gửi lại mã
                  </Button>
                ) : (
                  <>Bạn có thể gửi lại mã sau {timer}s</>
                )}
              </Typography>
            </>
          )}

          {step === 3 && (
            <TextField
              label="Mật khẩu mới"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#ec407a" }} />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleNext}
            sx={{
              mt: 3,
              backgroundColor: "#90a4ae",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#546e7a",
              },
            }}
          >
            {step === 1
              ? "Gửi mã xác nhận"
              : step === 2
              ? "Xác minh mã"
              : "Xác nhận"}
          </Button>

          <Typography textAlign="center" mt={3}>
            Đã nhớ mật khẩu?{" "}
            <Box
              component="span"
              sx={{
                color: "#546e7a",
                fontWeight: "bold",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => router.push("/auth/login")}
            >
              Đăng nhập
            </Box>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
