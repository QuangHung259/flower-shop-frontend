//src/app/shop/page.js
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container, Grid, Typography, Box } from "@mui/material";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import SearchQuery from "./SearchQuery";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";

  // 🔄 Fetch sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  // 🔄 Fetch danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        const data = await res.json();
        setCategories([{ name: "Tất cả", _id: "all" }, ...data]);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  // 🧠 Lọc sản phẩm mỗi khi sản phẩm, tìm kiếm, hoặc danh mục thay đổi
  useEffect(() => {
    let updated = [...products];

    if (query) {
      updated = updated.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "all") {
      updated = updated.filter((product) => {
        const cat = product.category;
        return cat === selectedCategory || cat?._id === selectedCategory;
      });
    }

    setFilteredProducts(updated);
  }, [products, query, selectedCategory]);

  // 🔐 Lấy user & cart theo userId
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user?._id;
    setUserId(id);

    const cartKey = id ? `cart_${id}` : "cart";
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCart(storedCart);
  }, []);

  // ➕ Thêm vào giỏ hàng
  const addToCart = (product) => {
    if (!userId) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return;
    }

    const cartKey = `cart_${userId}`;
    const existingIndex = cart.findIndex((item) => item._id === product._id);
    let updatedCart = [...cart];

    if (existingIndex !== -1) {
      updatedCart[existingIndex].quantity =
        (updatedCart[existingIndex].quantity || 1) + 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <>
      <Box sx={{ borderBottom: "2px solid #ddd" }}>
        <Navbar
          cartCount={cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
        />
      </Box>

      <Container sx={{ mt: 12, mb: 8 }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ fontFamily: "'Playfair Display', serif", mb: 4 }}
        >
          Danh Mục Sản Phẩm
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
            mb: 6,
            flexWrap: "wrap",
          }}
        >
          {categories.map((cat) => (
            <Box
              key={cat._id}
              sx={{
                cursor: "pointer",
                fontWeight: selectedCategory === cat._id ? "bold" : "normal",
                fontSize: "1.2rem",
                borderBottom:
                  selectedCategory === cat._id
                    ? "2px solid black"
                    : "2px solid transparent",
                pb: 0.5,
                transition: "all 0.3s",
              }}
              onClick={() => setSelectedCategory(cat._id)}
            >
              {cat.name}
            </Box>
          ))}
        </Box>
        <Suspense fallback={<div>Loading...</div>}>
          <SearchQuery>
            {(query) => (
              <>
                {query && (
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Kết quả tìm kiếm cho: &quot;<strong>{query}</strong>&quot;
                  </Typography>
                )}

                <Grid container spacing={3} justifyContent="center">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <Grid item xs={12} sm={6} md={3} key={product._id}>
                        <ProductCard product={product} addToCart={addToCart} />
                      </Grid>
                    ))
                  ) : (
                    <Typography variant="body1" sx={{ mt: 4 }}>
                      Không tìm thấy sản phẩm nào phù hợp.
                    </Typography>
                  )}
                </Grid>
              </>
            )}
          </SearchQuery>
        </Suspense>
      </Container>
    </>
  );
}
