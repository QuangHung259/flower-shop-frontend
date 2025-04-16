// src/app/admin/shipping/edit/[id]/page.js
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { getOrders } from "@/lib/orderApi";
import { getAllShipping, updateShipping } from "@/lib/shippingApi";

export default function ShippingEdit() {
  const { id } = useParams(); // shippingId
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    orderId: "",
    carrier: "",
    trackingNumber: "",
    status: "pending",
    estimatedDelivery: "",
    actualDelivery: "",
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load orders + shipping record
  useEffect(() => {
    const loadData = async () => {
      try {
        const [oRes, sRes] = await Promise.all([getOrders(), getAllShipping()]);
        setOrders(oRes.data);

        const shipping = sRes.data.shippings.find((s) => s._id === id);
        if (!shipping) throw new Error("Không tìm thấy thông tin vận chuyển");

        setFormData({
          orderId: shipping.order._id,
          carrier: shipping.carrier || "",
          trackingNumber: shipping.trackingNumber || "",
          status: shipping.status || "pending",
          estimatedDelivery: shipping.estimatedDelivery
            ? shipping.estimatedDelivery.slice(0, 10)
            : "",
          actualDelivery: shipping.actualDelivery
            ? shipping.actualDelivery.slice(0, 10)
            : "",
        });
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setSnackbar({ open: true, message: err.message, severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    if (id) loadData();
  }, [id]);

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateShipping(id, formData);
      setSnackbar({
        open: true,
        message: "Cập nhật thành công!",
        severity: "success",
      });
      setTimeout(() => router.replace("/admin/shipping"), 1000);
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      setSnackbar({
        open: true,
        message: "Cập nhật thất bại",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>
        Sửa thông tin vận chuyển
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
                {order._id} – {order.status} –{" "}
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
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Trạng thái"
          >
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
          Cập nhật
        </Button>
      </form>

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
    </Box>
  );
}
