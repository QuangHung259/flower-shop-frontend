// src/app/admin/users/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Button,
  Stack,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { getUsers, toggleUserRole, deleteUser } from "@/lib/userApi";

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy người dùng:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (id, role) => {
    try {
      await toggleUserRole(id, role === "admin" ? "customer" : "admin");
      setSnackbar({
        open: true,
        message: "Đổi vai trò thành công",
        severity: "success",
      });
      fetchUsers();
    } catch (err) {
      console.error("Lỗi đổi vai trò:", err);
      setSnackbar({
        open: true,
        message: "Đổi vai trò thất bại",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá người dùng này?")) return;
    try {
      await deleteUser(id);
      setSnackbar({
        open: true,
        message: "Xoá người dùng thành công",
        severity: "success",
      });
      fetchUsers();
    } catch (err) {
      console.error("Lỗi xoá người dùng:", err);
      setSnackbar({ open: true, message: "Xoá thất bại", severity: "error" });
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Danh sách người dùng</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/admin/users/new")}
        >
          + Thêm người dùng
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Họ tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell sx={{ textTransform: "capitalize" }}>
                  {user.role}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleToggleRole(user._id, user.role)}
                    >
                      {user.role === "admin"
                        ? "Chuyển thành Customer"
                        : "Chuyển thành Admin"}
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(user._id)}
                    >
                      Xoá
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
