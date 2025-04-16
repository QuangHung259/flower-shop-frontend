//src/app/cart/page.js
"use client";

import {
  Container,
  Typography,
  List,
  Button,
  Box,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user?._id;
    setUserId(id);

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

  const updateLocalStorage = (updatedCart) => {
    setCart(updatedCart);
    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
    }
  };

  const changeQuantity = (index, delta) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = Math.max(
      1,
      updatedCart[index].quantity + delta
    );
    updateLocalStorage(updatedCart);
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    updateLocalStorage(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (!userId) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6">
          Vui lòng đăng nhập để xem giỏ hàng.
        </Typography>
        <Button
          component={Link}
          href="/auth/login"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Đăng nhập
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        backgroundImage: 'url("/images/bgrcart.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        py: 6,
      }}
    >
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <MuiLink
            component={Link}
            href="/"
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Trang chủ
          </MuiLink>
          <Typography color="text.primary">Giỏ hàng</Typography>
        </Breadcrumbs>

        <Box sx={{ textAlign: "center", my: 5 }}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 50, color: "#e91e63" }} />
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              mt: 2,
              background: "linear-gradient(90deg, #ec4899, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 1,
            }}
          >
            Giỏ hàng của bạn
          </Typography>
          <Box
            sx={{
              height: "3px",
              width: "80px",
              backgroundColor: "#e91e63",
              borderRadius: "999px",
              mx: "auto",
              mt: 1,
            }}
          />
        </Box>

        {cart.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="body1">Giỏ hàng trống!</Typography>
            <Button
              component={Link}
              href="/shop"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Quay lại cửa hàng
            </Button>
          </Box>
        ) : (
          <>
            <List>
              {cart.map((item, index) => (
                <Card
                  key={index}
                  sx={{ mb: 2, display: "flex", alignItems: "center" }}
                >
                  {item.image && (
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt={item.name}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        ml: 2,
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography color="text.secondary">
                      Giá: {item.price.toLocaleString()} VND
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 1,
                        gap: 1,
                      }}
                    >
                      <Typography>Số lượng:</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => changeQuantity(index, -1)}
                      >
                        -
                      </Button>
                      <Typography>{item.quantity}</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => changeQuantity(index, 1)}
                      >
                        +
                      </Button>
                    </Box>
                  </CardContent>
                  <Box sx={{ pr: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeFromCart(index)}
                    >
                      Xóa
                    </Button>
                  </Box>
                </Card>
              ))}
            </List>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Tổng cộng:</Typography>
              <Typography variant="h6">
                {calculateTotal().toLocaleString()} VND
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5 }}
              onClick={handleCheckout}
            >
              Tiến hành thanh toán
            </Button>
          </>
        )}
      </Container>
    </Box>
  );
}
