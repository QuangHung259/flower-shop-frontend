//src/admin/products/[id]/edit/page.js
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { getProductById, updateProduct, getCategories } from "@/lib/productApi";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function ProductEdit() {
  const { id } = useParams();
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          getProductById(id),
          getCategories(),
        ]);

        const product = productRes.data;
        setValue("name", product.name);
        setValue("price", product.price);
        setValue("stock", product.stock);
        setValue("description", product.description);
        setValue("category", product.category?._id || "");
        setSelectedCategory(product.category?._id || "");

        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Lỗi khi load dữ liệu:", err);
      }
    };

    if (id) fetchProductAndCategories();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    const productData = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      category: selectedCategory,
    };

    await updateProduct(id, productData);
    router.push("/admin/products");
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Sửa sản phẩm
        </Typography>

        <TextField
          label="Tên sản phẩm"
          fullWidth
          margin="normal"
          {...register("name")}
        />
        <TextField
          label="Giá"
          type="number"
          fullWidth
          margin="normal"
          {...register("price")}
        />
        <TextField
          label="Tồn kho"
          type="number"
          fullWidth
          margin="normal"
          {...register("stock")}
        />

        {/* ✅ Dropdown chọn danh mục */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Danh mục</InputLabel>
          <Select
            labelId="category-label"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setValue("category", e.target.value); // Đảm bảo hook-form cũng biết
            }}
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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Cập nhật
        </Button>
      </Box>
    </Container>
  );
}
