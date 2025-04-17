"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  TextField,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import Image from "next/image";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInitial, setUserInitial] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const scrollToAbout = () => {
    if (window.location.pathname === "/") {
      const aboutSection = document.getElementById("about-section");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/#about-section");
    }
  };

  const updateCartCount = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;
    if (userId) {
      const cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const email = localStorage.getItem("userEmail") || "";
      setIsLoggedIn(loggedIn);
      setUserInitial(email ? email.charAt(0).toUpperCase() : "");
      updateCartCount();
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setAnchorEl(null);
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/shop?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "white", boxShadow: "none", py: 2 }}
    >
      <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo bên trái */}
        <Box sx={{ flex: 1 }}>
          <Link href="/" passHref>
            <Image
              src="/images/logo.png"
              alt="Logo"
              style={{ height: "60px", cursor: "pointer" }}
            />
          </Link>
        </Box>

        {/* Menu chính giữa */}
        <Box
          sx={{
            flex: 2,
            display: "flex",
            justifyContent: "center",
            gap: 4,
            fontSize: "18px",
          }}
        >
          <Link href="/" passHref>
            <Button
              sx={{ textTransform: "none", color: "black", fontSize: "18px" }}
            >
              Trang chủ
            </Button>
          </Link>
          <Button
            onClick={scrollToAbout}
            sx={{ textTransform: "none", color: "black", fontSize: "18px" }}
          >
            Giới thiệu
          </Button>
          <Link href="/shop" passHref>
            <Button
              sx={{ textTransform: "none", color: "black", fontSize: "18px" }}
            >
              Cửa hàng
            </Button>
          </Link>
          <Link href="/contact" passHref>
            <Button
              sx={{ textTransform: "none", color: "black", fontSize: "18px" }}
            >
              Liên hệ
            </Button>
          </Link>
        </Box>

        {/* Icons bên phải */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Search */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              variant="standard"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              InputProps={{ disableUnderline: true }}
              sx={{
                width: 150,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                px: 1,
              }}
            />
            <IconButton onClick={handleSearch}>
              <SearchIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>

          {/* Avatar hoặc Login */}
          {isLoggedIn ? (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#f48fb1",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {userInitial}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    router.push("/orders");
                    setAnchorEl(null);
                  }}
                >
                  Đơn hàng của tôi
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton onClick={() => router.push("/auth/login")}>
              <PersonIcon sx={{ color: "black" }} />
            </IconButton>
          )}

          {/* Giỏ hàng */}
          <IconButton color="inherit">
            <Link href="/cart" passHref>
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon sx={{ color: "black" }} />
              </Badge>
            </Link>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
