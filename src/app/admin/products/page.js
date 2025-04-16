//src/admin/products/page.js
"use client";

import {
  Box,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts, deleteProduct } from "@/lib/productApi";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      try {
        await deleteProduct(id);
        setSnackbar({
          open: true,
          message: "Đã xóa sản phẩm",
          type: "success",
        });
        fetchProducts();
      } catch (err) {
        console.error("Lỗi khi xóa sản phẩm:", err);
        setSnackbar({ open: true, message: "Xóa thất bại", type: "error" });
      }
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Danh sách sản phẩm</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => router.push("/admin/products/new")}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Tồn kho</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    width={60}
                    height={60}
                    style={{ objectFit: "cover" }}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>{product.price.toLocaleString()}₫</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() =>
                      router.push(`/admin/products/${product._id}/edit`)
                    }
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(product._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.type} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
