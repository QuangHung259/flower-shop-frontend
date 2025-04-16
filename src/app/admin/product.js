"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";
import ProductForm from "../../../components/ProductForm";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    const res = await axios.get(`/api/products?name=${search}`);
    setProducts(res.data);
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 3 }}>
        Quản lý Sản phẩm
      </Typography>

      <TextField
        label="Tìm kiếm theo tên"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mr: 2 }}
      />
      <Button variant="contained" color="primary" onClick={fetchProducts}>
        Tìm kiếm
      </Button>

      <Button
        variant="contained"
        color="success"
        sx={{ ml: 2 }}
        startIcon={<Add />}
        onClick={() => {
          setSelectedProduct(null);
          setOpen(true);
        }}
      >
        Thêm sản phẩm
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}₫</TableCell>
                <TableCell>
                  <img src={product.image} alt={product.name} width="50" />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedProduct(product);
                      setOpen(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(product._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ProductForm open={open} handleClose={() => setOpen(false)} product={selectedProduct} refresh={fetchProducts} />
    </Container>
  );
}
