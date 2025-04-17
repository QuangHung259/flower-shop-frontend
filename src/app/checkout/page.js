"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Card,
  Divider,
  Grid,
  IconButton,
  Badge,
  Radio,
  RadioGroup,
  FormControl,
  FormHelperText,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Img from "next/image";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
  });

  const [errors, setErrors] = useState({});

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

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const totalPrice = cart.reduce((total, item) => {
    const quantity = parseInt(item.quantity) || 0;
    const price = parseInt(item.price) || 0;
    return total + quantity * price;
  }, 0);

  const shippingFee = totalPrice > 500000 ? 0 : 50000;
  const finalTotal = totalPrice + shippingFee;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email không được để trống";
    if (!formData.phone) newErrors.phone = "Số điện thoại không được để trống";
    if (!formData.firstName) newErrors.firstName = "Họ không được để trống";
    if (!formData.lastName) newErrors.lastName = "Tên không được để trống";
    if (paymentMethod === "cod" && !formData.address)
      newErrors.address = "Địa chỉ không được để trống nếu giao hàng";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user || !token) {
      alert("Bạn cần đăng nhập trước khi thanh toán.");
      router.push("/login");
      return;
    }

    if (!validateForm()) {
      return;
    }

    const fullAddress =
      paymentMethod === "pickup"
        ? "Tự đến lấy hàng tại cửa hàng"
        : `${formData.address}, ${formData.apartment}`;

    const orderData = {
      products: cart.map((product) => ({
        product: product._id,
        quantity: product.quantity || 1,
      })),
      totalAmount: finalTotal,
      shippingAddress: fullAddress,
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

      const paymentRes = await fetch(
        `${API_URL}/api/payments/${paymentMethod}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: order._id,
            amount: order.totalAmount,
          }),
        }
      );

      if (!paymentRes.ok) throw new Error("Thanh toán thất bại");

      localStorage.removeItem(`cart_${user._id}`);
      router.push("/orders");
    } catch (err) {
      console.error("Lỗi đặt hàng:", err.message);
      alert("Có lỗi khi đặt hàng. Vui lòng thử lại.");
    }
  };

  return (
    <>
      {/* Navbar */}
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
            <Badge badgeContent={cart?.length || 0} color="secondary">
              <ShoppingBagIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Checkout Content */}
      <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Left - Form */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Thông tin liên hệ
            </Typography>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              margin="normal"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              error={!!errors.phone}
              helperText={errors.phone}
            />

            <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
              Giao hàng
            </Typography>
            <TextField
              fullWidth
              label="Thành phố"
              value="Hồ Chí Minh"
              disabled
              margin="normal"
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Họ"
                  margin="normal"
                  value={formData.firstName}
                  onChange={handleInputChange("firstName")}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tên"
                  margin="normal"
                  value={formData.lastName}
                  onChange={handleInputChange("lastName")}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
              Hình thức nhận hàng
            </Typography>

            <FormControl component="fieldset" sx={{ mt: 1 }}>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                row
              >
                <FormControlLabel
                  value="cod"
                  control={<Radio />}
                  label="Giao hàng tận nơi (COD)"
                />
                <FormControlLabel
                  value="pickup"
                  control={<Radio />}
                  label="Đến lấy tại cửa hàng"
                />
              </RadioGroup>
            </FormControl>

            {paymentMethod === "cod" && (
              <>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  margin="normal"
                  value={formData.address}
                  onChange={handleInputChange("address")}
                  error={!!errors.address}
                  helperText={errors.address}
                />
                <TextField
                  fullWidth
                  label="Căn hộ, số tầng,... (tuỳ chọn)"
                  margin="normal"
                  value={formData.apartment}
                  onChange={handleInputChange("apartment")}
                />
              </>
            )}
          </Grid>

          {/* Right - Order Summary */}
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Đơn hàng
              </Typography>

              {cart.map((item, index) => (
                <Box key={index} sx={{ display: "flex", mb: 2 }}>
                  <Img
                    src={item.imageUrl}
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography>Phí giao hàng:</Typography>
                <Typography>
                  {shippingFee === 0
                    ? "Miễn phí"
                    : `${shippingFee.toLocaleString()} VND`}
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
                ĐẶT HÀNG
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
