//src/admin/products/new/page.js
"use client";

import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { createProduct, uploadImage, getCategories } from "@/lib/productApi";
import { useRouter } from "next/navigation";

export default function ProductForm() {
  const { register, handleSubmit, setValue } = useForm();
  const [categories, setCategories] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (formData) => {
    try {
      let imageUrl = "";

      if (formData.image && formData.image.length > 0) {
        const imageForm = new FormData();
        imageForm.append("image", formData.image[0]);
        const uploadRes = await uploadImage(imageForm);
        imageUrl = uploadRes.data.imageUrl;
      }

      const productData = {
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        description: formData.description,
        imageUrl,
      };

      await createProduct(productData);

      // Hiện thông báo
      setOpenSnackbar(true);

      // Chuyển trang sau 1.5 giây
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    } catch (err) {
      console.error("Lỗi backend:", err.response?.data || err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Thêm sản phẩm
        </Typography>

        <TextField
          label="Tên sản phẩm"
          fullWidth
          margin="normal"
          required
          {...register("name")}
        />
        <TextField
          label="Giá"
          type="number"
          fullWidth
          margin="normal"
          required
          {...register("price")}
        />
        <TextField
          label="Tồn kho"
          type="number"
          fullWidth
          margin="normal"
          required
          {...register("stock")}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Danh mục</InputLabel>
          <Select
            labelId="category-label"
            defaultValue=""
            {...register("category")}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Mô tả"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          {...register("description")}
        />

        <input
          type="file"
          accept="image/*"
          {...register("image")}
          required
          style={{ marginTop: "16px" }}
        />

        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 2 }}
        >
          Lưu sản phẩm
        </Button>
      </Box>

      {/* ✅ Snackbar thông báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          Thêm sản phẩm thành công!
        </Alert>
      </Snackbar>
    </Container>
  );
}
