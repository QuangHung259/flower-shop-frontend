import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CardContent, Typography, Box, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function ProductCard({ product, addToCart }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        cursor: "pointer",
        textAlign: "center",
        backgroundColor: "white",
        padding: 2,
        maxWidth: 300,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* SALE badge */}
      {product.discount && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "#D32F2F",
            color: "white",
            padding: "2px 8px",
            fontSize: 12,
            fontWeight: "bold",
            borderRadius: "4px",
            zIndex: 2,
          }}
        >
          SALE
        </Box>
      )}

      {/* Ảnh sản phẩm */}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <Link
          href={`/shop/${product._id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={300}
            height={300}
            style={{
              width: "250px",
              height: "250px",
              objectFit: "cover",
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Link>

        {/* Hiệu ứng hover với các icon */}
        {hovered && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              gap: 2,
              zIndex: 1,
            }}
          >
            <IconButton
              sx={{ color: "white", backgroundColor: "rgba(255,255,255,0.6)" }}
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              sx={{ color: "white", backgroundColor: "rgba(255,255,255,0.6)" }}
              onClick={() => addToCart(product)}
            >
              <ShoppingCartIcon />
            </IconButton>
            <IconButton
              sx={{ color: "white", backgroundColor: "rgba(255,255,255,0.6)" }}
            >
              <FavoriteIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Thông tin sản phẩm */}
      <CardContent sx={{ backgroundColor: "white" }}>
        <Typography
          variant="subtitle1"
          fontWeight="medium"
          sx={{ textTransform: "capitalize" }}
        >
          {product.name}
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
          {product.discount ? (
            <>
              <Typography variant="h8" fontWeight="bold" color="error">
                {Number(product.price).toLocaleString("vi-VN", {
                  minimumFractionDigits: 0,
                })}{" "}
                VND
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: "line-through" }}
              >
                {Number(product.originalPrice || 0).toLocaleString("vi-VN", {
                  minimumFractionDigits: 0,
                })}{" "}
                VND
              </Typography>
            </>
          ) : (
            <Typography variant="h8" fontWeight="bold">
              {Number(product.price).toLocaleString("vi-VN", {
                minimumFractionDigits: 0,
              })}{" "}
              VND
            </Typography>
          )}
        </Box>
      </CardContent>
    </Box>
  );
}
