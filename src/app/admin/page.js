//src/app/admin/page.js
"use client";

import { useEffect } from "react";
import axios from "axios";
import { Box, Button, Grid, Typography, Paper } from "@mui/material";
import { useRouter } from "next/navigation";

export default function AdminHome() {
  const router = useRouter();

  // Kiểm tra quyền admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await axios.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.user.role !== "admin") {
          alert("Bạn không có quyền truy cập trang này!");
          router.push("/"); // Chuyển hướng về home
          return;
        }

        // Nếu là admin thì mới gọi dữ liệu
        fetchData(token);
      } catch (err) {
        console.error("Lỗi xác thực:", err);
        router.push("/login");
      }
    };

    const fetchData = async (token) => {
      try {
        await axios.get("/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        await axios.get("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        await axios.get("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      }
    };

    checkAdmin();
  }, [router]);

  const sections = [
    { label: "Quản lý Sản Phẩm", href: "/admin/products", color: "primary" },
    {
      label: "Quản lý Danh Mục",
      href: "/admin/categories",
      color: "secondary",
    },
    { label: "Quản lý Đơn Hàng", href: "/admin/orders", color: "success" },
    { label: "Quản lý Người Dùng", href: "/admin/users", color: "warning" },
    { label: "Quản lý Vận Chuyển", href: "/admin/shipping", color: "info" },
    { label: "Quản lý Liên Hệ", href: "/admin/contact", color: "error" },
  ];

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom>
        Trang Quản Trị
      </Typography>

      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.href}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {section.label}
              </Typography>
              <Button
                variant="contained"
                color={section.color}
                onClick={() => router.push(section.href)}
                fullWidth
              >
                {section.label}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
