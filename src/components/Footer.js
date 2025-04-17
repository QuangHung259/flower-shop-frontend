"use client";

import React from "react";
import { Box, Container, Grid, Typography, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import Link from "next/link";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#f8f8f8", py: 6, mt: 10 }}>
      <Container>
        <Grid container spacing={4}>
          {/* Giới thiệu shop */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
            𝓯𝓵𝓸𝓻𝓪𝓵 𝓱𝓪𝓿𝓮𝓷 🌷
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nơi gửi gắm yêu thương qua từng đóa hoa. Đặt hoa nhanh chóng, giao tận nơi với chất lượng tuyệt vời.
            </Typography>
          </Grid>

          {/* Liên kết nhanh */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Liên kết nhanh
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/" passHref>
                <Typography variant="body2" color="text.secondary">Trang chủ</Typography>
              </Link>
              <Link href="/shop" passHref>
                <Typography variant="body2" color="text.secondary">Cửa hàng</Typography>
              </Link>
              <Link href="/contact" passHref>
                <Typography variant="body2" color="text.secondary">Liên hệ</Typography>
              </Link>
            </Box>
          </Grid>

          {/* Liên hệ & MXH */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Liên hệ
            </Typography>
            <Typography variant="body2" color="text.secondary">📍 69/68 Đ.Đặng Thuỳ Trâm, Bình Thạnh,TP.Hồ Chí Minh</Typography>
            <Typography variant="body2" color="text.secondary">📞 0336567177</Typography>
            <Typography variant="body2" color="text.secondary">📧 contact@floralhaven.vn</Typography>

            {/* MXH */}
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <IconButton
                href="https://facebook.com"
                target="_blank"
                sx={{
                  backgroundColor: "#e0e0e0",
                  color: "#3b5998",
                  "&:hover": {
                    backgroundColor: "#ec407a",
                    color: "white",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <FacebookIcon />
              </IconButton>

              <IconButton
                href="https://instagram.com"
                target="_blank"
                sx={{
                  backgroundColor: "#e0e0e0",
                  color: "#e1306c",
                  "&:hover": {
                    backgroundColor: "#ec407a",
                    color: "white",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Bản quyền */}
        <Box sx={{ textAlign: "center", mt: 4, color: "gray", fontSize: 14 }}>
          © {new Date().getFullYear()} Floral Haven. All rights reserved.
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
