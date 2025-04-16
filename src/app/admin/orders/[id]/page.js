"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { getOrderById } from "@/lib/orderApi";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        console.error("Lỗi lấy chi tiết đơn hàng:", err);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (!order) return <Typography>Đang tải...</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Chi tiết đơn hàng #{order._id.slice(-6)}
      </Typography>

      <Typography>
        <strong>Khách hàng:</strong> {order.customerName}
      </Typography>
      <Typography>
        <strong>Email:</strong> {order.customerEmail}
      </Typography>
      <Typography>
        <strong>SĐT:</strong> {order.customerPhone}
      </Typography>
      <Typography>
        <strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}
      </Typography>
      <Typography>
        <strong>Trạng thái:</strong> {order.status}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Danh sách sản phẩm
      </Typography>
      <List>
        {order.products.map((item, idx) => (
          <ListItem key={idx} disablePadding>
            <ListItemText
              primary={`${item.product?.name} - SL: ${item.quantity}`}
              secondary={`Giá: ${item.product?.price?.toLocaleString()}₫`}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" fontWeight="bold">
        Tổng tiền: {order.totalAmount.toLocaleString()}₫
      </Typography>
    </Box>
  );
}
