"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { getOrders, deleteOrder, updateOrderStatus } from "@/lib/orderApi";

export default function OrderList() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách đơn hàng:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá đơn hàng này?")) return;
    try {
      await deleteOrder(id);
      fetchOrders();
    } catch (err) {
      console.error("Lỗi xoá đơn hàng:", err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      fetchOrders();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Danh sách đơn hàng
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
              <TableCell>Xem chi tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id.slice(-6)}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.customerEmail}</TableCell>
                <TableCell align="right">
                  {order.totalAmount.toLocaleString()}₫
                </TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    <MenuItem value="pending">Chờ xác nhận</MenuItem>
                    <MenuItem value="processing">Đang xử lý</MenuItem>
                    <MenuItem value="shipped">
                      Đã giao cho đơn vị vận chuyển
                    </MenuItem>
                    <MenuItem value="delivered">Đã giao hàng</MenuItem>
                    <MenuItem value="canceled">Đã huỷ</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(order._id)}
                  >
                    Xoá
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    component={Link}
                    href={`/admin/orders/${order._id}`}
                    size="small"
                  >
                    Xem
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
