"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  TextField,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Badge,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user?._id;

    if (id) {
      const storedCart = JSON.parse(localStorage.getItem(`cart_${id}`)) || [];

      const cleanedCart = storedCart.map((item) => ({
        ...item,
        quantity: Number(item.quantity) || 1,
        price:
          typeof item.price === "string"
            ? Number(item.price.replace(/,/g, ""))
            : Number(item.price) || 0,
      }));

      setCart(cleanedCart);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email không được để trống";
    if (!formData.phone) errors.phone = "Số điện thoại không được để trống";
    if (!formData.firstName) errors.firstName = "Họ không được để trống";
    if (!formData.lastName) errors.lastName = "Tên không được để trống";
    if (!formData.address) errors.address = "Địa chỉ không được để trống";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const shippingFee = totalPrice > 500000 ? 0 : 50000;
  const finalTotal = totalPrice + shippingFee;

  const handleOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      alert("Bạn cần đăng nhập trước khi thanh toán.");
      router.push("/auth/login");
      return;
    }

    if (!validateForm()) return;

    const orderData = {
      products: cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
      totalAmount: finalTotal,
      shippingAddress: formData.address,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerPhone: formData.phone,
      customerEmail: formData.email,
    };

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Tạo đơn hàng thất bại");

      const { order } = await res.json();

      const paymentRes = await fetch(`${API_URL}/api/payments/cod`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          amount: order.totalAmount,
        }),
      });

      if (!paymentRes.ok) throw new Error("Thanh toán thất bại");

      localStorage.removeItem(`cart_${user._id}`);
      alert("Đặt hàng thành công!");
      router.push("/orders");
    } catch (err) {
      console.error("Lỗi đặt hàng:", err.message);
      alert("Có lỗi khi đặt hàng. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            Floral Haven
          </Typography>
          <IconButton onClick={() => router.push("/cart")}>
            <Badge badgeContent={cart.length} color="secondary">
              <ShoppingBagIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          {/* LEFT FORM */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Thông tin giao hàng
            </Typography>
            <TextField
              name="email"
              label="Email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              name="phone"
              label="Số điện thoại"
              fullWidth
              margin="normal"
              value={formData.phone}
              onChange={handleChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="firstName"
                  label="Họ"
                  fullWidth
                  margin="normal"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="lastName"
                  label="Tên"
                  fullWidth
                  margin="normal"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                />
              </Grid>
            </Grid>
            <TextField
              name="address"
              label="Địa chỉ"
              fullWidth
              margin="normal"
              value={formData.address}
              onChange={handleChange}
              error={!!formErrors.address}
              helperText={formErrors.address}
            />
             <TextField fullWidth label="Thành phố" value="Hồ Chí Minh" disabled margin="normal" />
          </Grid>
          

          {/* RIGHT SUMMARY */}
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Đơn hàng
              </Typography>

              {cart.length === 0 ? (
                <Typography color="error" fontStyle="italic">
                  Giỏ hàng trống
                </Typography>
              ) : (
                <>
                  {cart.map((item, index) => (
                    <Box key={index} sx={{ display: "flex", mb: 2 }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 8,
                          marginRight: 12,
                        }}
                      />
                      <Box>
                        <Typography>{item.name}</Typography>
                        <Typography color="text.secondary">
                          x{item.quantity || 1}
                        </Typography>
                      </Box>
                      <Box sx={{ ml: "auto", fontWeight: 500 }}>
                        {(item.price * (item.quantity || 1)).toLocaleString()} VND
                      </Box>
                    </Box>
                  ))}

                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Tạm tính:</Typography>
                    <Typography>{totalPrice.toLocaleString()} VND</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography>Phí giao hàng:</Typography>
                    <Typography>
                      {shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString()} VND`}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    <Typography>Tổng cộng:</Typography>
                    <Typography color="#8bc34a">
                      {finalTotal.toLocaleString()} VND
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleOrder}
                    sx={{ py: 1.5, backgroundColor: "#8bc34a" }}
                  >
                    Đặt hàng
                  </Button>
                </>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
