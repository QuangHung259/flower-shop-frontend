"use client";

import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { createCategory } from "@/lib/categoryApi";
import { useState } from "react";

export default function CategoryFormPage() {
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    try {
      await createCategory(data);
      alert("✅ Tạo danh mục thành công!");
      reset();
      setError(null);
    } catch (err) {
      console.error("❌ Lỗi:", err);
      setError(err?.response?.data?.message || "Lỗi khi tạo danh mục");
    }
  };

  return (
    <Paper sx={{ maxWidth: 500, margin: "auto", mt: 4, p: 3 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Thêm danh mục mới
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          fullWidth
          label="Tên danh mục"
          {...register("name", { required: "Tên danh mục là bắt buộc" })}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Mô tả"
          {...register("description")}
          margin="normal"
          multiline
          rows={3}
        />

        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 2 }}
        >
          Lưu danh mục
        </Button>
      </Box>
    </Paper>
  );
}
