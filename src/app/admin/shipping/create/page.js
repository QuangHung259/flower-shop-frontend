// app/admin/shipping/create/page.js
// app/admin/shipping/create/page.js
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { getOrders } from "@/lib/orderApi";
import { createShipping } from "@/lib/shippingApi";

const ShippingCreate = () => {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    orderId: "",
    carrier: "",
    trackingNumber: "",
    status: "pending",
    estimatedDelivery: "",
    actualDelivery: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders(); // ✅ dùng trực tiếp
        setOrders(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createShipping(formData);
      alert("Tạo thông tin vận chuyển thành công");
      router.replace("/admin/shipping");
    } catch (error) {
      console.error("Lỗi khi tạo shipping:", error);
      alert("Tạo thất bại");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>
        Tạo thông tin vận chuyển
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Chọn đơn hàng</InputLabel>
          <Select
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            label="Chọn đơn hàng"
          >
            {orders.map((order) => (
              <MenuItem key={order._id} value={order._id}>
                {order._id} - {order.status} -{" "}
                {order.totalAmount.toLocaleString()}₫
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Hãng vận chuyển"
          name="carrier"
          value={formData.carrier}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Mã theo dõi"
          name="trackingNumber"
          value={formData.trackingNumber}
          onChange={handleChange}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Trạng thái</InputLabel>
          <Select name="status" value={formData.status} onChange={handleChange}>
            <MenuItem value="pending">Chờ xử lý</MenuItem>
            <MenuItem value="in_transit">Đang giao</MenuItem>
            <MenuItem value="delivered">Đã giao</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="date"
          name="estimatedDelivery"
          value={formData.estimatedDelivery}
          onChange={handleChange}
          margin="normal"
          label="Ngày giao dự kiến"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          type="date"
          name="actualDelivery"
          value={formData.actualDelivery}
          onChange={handleChange}
          margin="normal"
          label="Ngày giao thực tế"
          InputLabelProps={{ shrink: true }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Tạo
        </Button>
      </form>
    </Box>
  );
};

export default ShippingCreate;
