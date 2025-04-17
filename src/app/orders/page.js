"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Box,
  Button,
  Tabs,
  Tab,
  Skeleton,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import React from "react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(null);
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChangeTab = (_, newValue) => setTab(newValue);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${API_URL}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Không thể lấy đơn hàng");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) return;

    setCanceling(id);
    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${API_URL}/api/orders/cancel/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Không thể hủy đơn hàng");

      const updated = await res.json();

      setOrders((prev) =>
        prev.map((order) => (order._id === id ? updated.order : order))
      );

      setSnackbar({
        open: true,
        message: "Đã hủy đơn hàng thành công!",
        severity: "success",
      });
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
      setSnackbar({
        open: true,
        message: "Hủy đơn hàng thất bại.",
        severity: "error",
      });
    } finally {
      setCanceling(null);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusText = {
    pending: "Đang chờ xử lý",
    processing: "Đang xử lý",
    shipped: "Đã vận chuyển",
    delivered: "Đã giao",
    canceled: "Đã hủy",
  };

  const currentOrders = orders.filter(
    (order) => order.status !== "canceled" && order.status !== "delivered"
  );

  const historyOrders = orders.filter(
    (order) => order.status === "canceled" || order.status === "delivered"
  );

  const renderOrderCard = (order) => (
    <Card key={order._id} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          Mã đơn: #{order._id}
        </Typography>
        <Typography>Ngày đặt: {formatDate(order.createdAt)}</Typography>
        <Typography>Người nhận: {order.customerName}</Typography>
        <Typography>Số điện thoại: {order.customerPhone}</Typography>
        <Typography>Email: {order.customerEmail}</Typography>
        <Typography>Địa chỉ: {order.shippingAddress}</Typography>
        <Typography>
          Trạng thái:{" "}
          <span
            style={{
              fontWeight: "bold",
              color: order.status === "canceled" ? "#f44336" : "#4caf50",
            }}
          >
            {statusText[order.status] || order.status}
          </span>
        </Typography>

        <Divider sx={{ my: 2 }} />

        {Array.isArray(order.products) && order.products.length > 0 ? (
          order.products.map((item, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <Img
                src={item.product?.imageUrl || "/images/default.jpg"}
                alt={item.product?.name || "Sản phẩm"}
                style={{ width: 50, height: 50, marginRight: 10 }}
              />
              <Box>
                <Typography>{item.product?.name || "Sản phẩm"}</Typography>
                <Typography color="text.secondary">x{item.quantity}</Typography>
              </Box>
              <Box sx={{ ml: "auto", fontWeight: "bold" }}>
                {(item.product?.price * item.quantity || 0).toLocaleString()}{" "}
                VND
              </Box>
            </Box>
          ))
        ) : (
          <Typography color="text.secondary">
            Không có sản phẩm nào trong đơn hàng.
          </Typography>
        )}

        <Divider sx={{ mt: 2, mb: 1 }} />
        <Typography fontWeight="bold" sx={{ mb: 1 }}>
          Tổng cộng: {order.totalAmount?.toLocaleString()} VND
        </Typography>

        {order.status === "pending" && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleCancelOrder(order._id)}
            disabled={canceling === order._id}
          >
            {canceling === order._id ? "Đang hủy..." : "Hủy đơn hàng"}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Đơn hàng của tôi
      </Typography>

      <Tabs value={tab} onChange={handleChangeTab} sx={{ mb: 3 }}>
        <Tab label="Đơn hiện tại" />
        <Tab label="Lịch sử đơn hàng" />
      </Tabs>

      {loading ? (
        <>
          {[...Array(2)].map((_, i) => (
            <Card key={i} sx={{ mb: 3, p: 2 }}>
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
            </Card>
          ))}
        </>
      ) : (
        <>
          {tab === 0 &&
            (currentOrders.length === 0 ? (
              <Typography>Không có đơn hàng nào.</Typography>
            ) : (
              currentOrders.map(renderOrderCard)
            ))}

          {tab === 1 &&
            (historyOrders.length === 0 ? (
              <Typography>Không có lịch sử đơn hàng.</Typography>
            ) : (
              historyOrders.map(renderOrderCard)
            ))}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
