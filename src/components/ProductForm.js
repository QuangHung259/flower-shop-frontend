"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import axios from "axios";

export default function ProductForm({ open, handleClose, product, refresh }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: 10,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        stock: 10,
      });
    }
    fetchCategories();
  }, [product]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (product) {
        await axios.put(`/api/products/${product._id}`, formData);
      } else {
        await axios.post("/api/products", formData);
      }
      refresh();
      handleClose();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{product ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Tên sản phẩm"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          sx={{ my: 2 }}
        />
        <TextField
          label="Mô tả"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          sx={{ my: 2 }}
        />
        <TextField
          label="Giá"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          sx={{ my: 2 }}
        />
        <TextField
          label="Ảnh URL"
          name="image"
          value={formData.image}
          onChange={handleChange}
          fullWidth
          sx={{ my: 2 }}
        />
        <TextField
          label="Danh mục"
          name="category"
          select
          value={formData.category}
          onChange={handleChange}
          fullWidth
          sx={{ my: 2 }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {product ? "Cập nhật" : "Thêm"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
