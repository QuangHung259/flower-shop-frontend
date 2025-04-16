// src/app/shop/[id]/page.js
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
} from "@mui/material";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Lấy userId từ localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user?._id;
    setUserId(id);

    if (id) {
      const storedCart = JSON.parse(localStorage.getItem(`cart_${id}`)) || [];
      const totalItems = storedCart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(totalItems);
    }
  }, []);

  // Lấy dữ liệu sản phẩm từ API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
        setProduct(null);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <>
        <Box sx={{ borderBottom: "2px solid #ddd" }}>
          <Navbar />
        </Box>
        <Container sx={{ mt: 10, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            Sản phẩm không tồn tại
          </Typography>
        </Container>
      </>
    );
  }

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  const handleAddToCart = () => {
    if (!userId) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ!");
      router.push("/login");
      return;
    }

    const cartKey = `cart_${userId}`;
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existingIndex = storedCart.findIndex(
      (item) => item._id === product._id
    );
    let updatedCart = [...storedCart];

    if (existingIndex !== -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({ ...product, quantity });
    }

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    const totalItems = updatedCart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    setCartCount(totalItems);
    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <>
      <Box sx={{ borderBottom: "2px solid #ddd" }}>
        <Navbar cartCount={cartCount} />
      </Box>

      <Container sx={{ mt: 5 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 4 }}>
          <Link href="/" color="inherit" style={{ textDecoration: "none" }}>
            Trang chủ
          </Link>
          <Link href="/shop" color="inherit" style={{ textDecoration: "none" }}>
            Cửa hàng
          </Link>
          <Typography color="textPrimary">{product.name}</Typography>
        </Breadcrumbs>

        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
          {/* Ảnh sản phẩm */}
          <Box flex={0.75}>
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={500}
                height={500}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  transition: "transform 0.3s ease-in-out",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.01)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 500,
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontStyle: "italic",
                  color: "gray",
                }}
              >
                Không có hình ảnh
              </Box>
            )}
          </Box>

          {/* Thông tin sản phẩm */}
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold">
              {product.name}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ my: 1, mb: 10 }}
            >
              {product.description}
            </Typography>

            <Typography variant="h5" color="black">
              {product.price.toLocaleString()} VND
            </Typography>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Typography fontWeight="bold">Quantity:</Typography>
                <IconButton onClick={() => handleQuantityChange("decrease")}>
                  <RemoveIcon />
                </IconButton>
                <Typography>{quantity}</Typography>
                <IconButton onClick={() => handleQuantityChange("increase")}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Typography variant="h6" fontWeight="bold" color="error">
                {(product.price * quantity).toLocaleString()} VND
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ width: "100%", fontWeight: "bold" }}
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
