//src/app/page.js
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Container, Grid, Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DesignServicesIcon from "@mui/icons-material/DesignServices";

export default function HomePage() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = user?._id;
    setUserId(id);

    if (id) {
      const storedCart = JSON.parse(localStorage.getItem(`cart_${id}`)) || [];
      setCart(storedCart);
    }
  }, []);

  const addToCart = (product) => {
    if (!userId) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return;
    }

    const cartKey = `cart_${userId}`;
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existingIndex = storedCart.findIndex(
      (item) => item._id === product._id
    );
    let updatedCart = [...storedCart];

    if (existingIndex !== -1) {
      updatedCart[existingIndex].quantity =
        (updatedCart[existingIndex].quantity || 1) + 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setCart(updatedCart);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // Gọi API để lấy sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar cartCount={cart.length} /> {/* Truyền cartCount vào Navbar */}

      {/* Banner */}
      <Box
        sx={{
          position: "relative",
          height: "85vh",
          backgroundImage: 'url("/images/home.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Lớp phủ tối giúp chữ dễ đọc hơn
          }}
        />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h3" fontWeight="bold">
            𝓯𝓵𝓸𝓻𝓪𝓵 𝓱𝓪𝓿𝓮𝓷
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, mb: 4 }} fontStyle={"italic"}>
            "Gửi gắm yêu thương trọn vẹn qua từng đóa hoa, mang đến những khoảnh khắc ý nghĩa." 
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/shop"
            sx={{
              backgroundColor: "#ffcccc",
              "&:hover": {
              backgroundColor: "#e91e63",
              },
            }}
          >
          ĐẶT HOA
          </Button>
        </Box>
      </Box>

      {/* Phần Giới thiệu */}
<Container id="about-section" sx={{ mt: 10, mb: 10 }}>
  {/* Section 1 */}
  <Grid container spacing={6} alignItems="center">
    <Grid item xs={12} md={6}>
      <Image
        src="/images/GioiThieu.jpg"
        alt="Giới thiệu Floral Haven"
        width={400}
        height={700}
        style={{ borderRadius: "8px", objectFit: "cover", width: "100%",
        transition: "transform 0.3s ease-in-out"
         }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <Typography variant="h4" fontWeight="bold" color="#ec407a">
        Thiết kế bó hoa cho riêng bạn
      </Typography>
      <Typography variant="h8" color="#ef6694">
        Floral Heaven – Biến Ý Tưởng Của Bạn Thành Những Bó Hoa Tuyệt Đẹp!
      </Typography>
      <Typography variant="body1" sx={{ mt: 4 }} fontSize={21}>
      Tại Floral Heaven, chúng tôi tin rằng mỗi bó hoa không chỉ đơn thuần là một món quà, mà còn là cách
      thể hiện cảm xúc, phong cách và dấu ấn riêng của mỗi người. Vì vậy, chúng tôi mang đến dịch vụ thiết
      kế bó hoa theo yêu cầu, giúp bạn tạo nên những tác phẩm hoa tươi độc đáo, phù hợp với từng dịp đặc
      biệt.<br/>
      Bạn có thể tùy chọn loại hoa yêu thích, màu sắc phù hợp với sự kiện, cũng như kiểu dáng bó hoa từ đơn
      giản, tinh tế đến sang trọng, lộng lẫy. Đội ngũ chuyên gia cắm hoa của chúng tôi sẽ tư vấn và thiết kế
      dựa trên mong muốn của bạn, đảm bảo mỗi bó hoa đều mang dấu ấn cá nhân. <br/>
      Chúng tôi chỉ sử dụng những bông hoa tươi nhất, được tuyển chọn kỹ lưỡng mỗi ngày, đảm bảo sự rực rỡ và lâu tàn.
      Mỗi bó hoa không chỉ đẹp mắt mà còn tỏa hương thơm nhẹ nhàng, tạo nên sự ấm áp và sang trọng.<br/>
      
      </Typography>
    </Grid>
  </Grid>

  {/* Section 2 */}
  <Grid container spacing={6} alignItems="center" sx={{ mt: 8 }}>
    <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
      <Typography variant="h4" fontWeight="bold" color="#ab47bc">
        Tô màu cho cuộc sống của bạn
      </Typography>
      <Typography variant="h8" fontWeight="bold" color="#bb6bc9">
        Hãy để Floral Heaven giúp bạn tô màu cho cuộc sống!
      </Typography>
      <Typography variant="body1" sx={{ mt: 4 }} fontSize={21}>
      Cuộc sống trở nên rực rỡ hơn khi được tô điểm bởi những sắc hoa tươi thắm. Tại Floral Heaven,
      chúng tôi mang đến những bó hoa đầy màu sắc, không chỉ là món quà trang trí mà còn là cách
      truyền tải cảm xúc và năng lượng tích cực đến những người bạn yêu thương.<br/>
      Mỗi bông hoa mang một ý nghĩa riêng, mỗi màu sắc gợi lên một cung bậc cảm xúc khác nhau.
      Dù là sắc hồng nhẹ nhàng của tình yêu, vàng rực rỡ của niềm vui hay trắng thuần khiết 
      của sự thanh lịch, Floral Heaven giúp bạn chọn lựa những bó hoa phù hợp nhất cho từng khoảnh khắc.<br/>
      Một bó hoa tươi thắm có thể thay lời muốn nói, gói trọn tình cảm chân thành dành cho gia đình, bạn bè, 
      người thân yêu. Mỗi sản phẩm từ Floral Heaven đều được thiết kế cẩn thận, mang đến sự tinh tế 
      và ý nghĩa trong từng cánh hoa.
      </Typography>
    </Grid>
    <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
      <Image
        src="/images/doahoa1.jpg"
        alt="Giới thiệu Floral Haven"
        width={400}
        height={700}
        style={{ borderRadius: "8px", objectFit: "cover", width: "100%",
        transition: "transform 0.3s ease-in-out"
         }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    </Grid>
  </Grid>
</Container>
{/* Best Sellers Section */}
<Box sx={{ mt: 10, mb: 10 }}>
  <Container>
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={6}>
        <Box sx={{ position: "relative", height: 1000 }}>
          <Image
            src="/images/bestsellers.jpg"
            alt="Sale Banner"
            fill
            style={{ objectFit: "contain" }}
          />
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              position: "absolute",
              top: "35%",
              left: "16%",
              color: "#ec407a",
              backgroundColor: "",
              padding: "10px 20px",
              fontFamily: "cursive",
            }}
          >
            Best sellers collection
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container spacing={2}>
          {products.slice(0, 4).map((product) => (
            <Grid item xs={6} key={product._id}>
              <ProductCard product={product} addToCart={addToCart} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  </Container>
</Box>
         
      {/* Vì sao nên chọn Floral Haven - With background & overlay */}
      <Box
        sx={{
          backgroundImage: 'url("/images/bgr1.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          py: 10,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 0,
          }}
        />
        <Container sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            sx={{ mb: 5, color: "#8e24aa" }}
          >
            Vì sao nên chọn Floral Haven?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4} textAlign="center">
              <LocalFloristIcon sx={{ fontSize: 60, color: "#ec407a", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold">
                Hoa tươi mỗi ngày
              </Typography>
              <Typography color="text.secondary">
                Chúng tôi cam kết cung cấp những đóa hoa tươi mới, được tuyển chọn kỹ lưỡng hàng ngày.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign="center">
              <LocalShippingIcon sx={{ fontSize: 60, color: "#ab47bc", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold">
                Giao nhanh 1 giờ
              </Typography>
              <Typography color="text.secondary">
                Dịch vụ giao hàng siêu tốc, đảm bảo hoa đến tay bạn trong thời gian ngắn nhất.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign="center">
              <DesignServicesIcon sx={{ fontSize: 60, color: "#8e24aa", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold">
                Thiết kế theo yêu cầu
              </Typography>
              <Typography color="text.secondary">
                Đội ngũ chuyên nghiệp sẵn sàng tạo nên bó hoa theo ý tưởng riêng của bạn.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>


      {/* Danh sách sản phẩm */}
      {/* <Container sx={{ mt: 6 }}>
      <Typography variant="h4" align="center" fontWeight="bold" color="" sx={{ mb: 5 }}>
    Danh sách sản phẩm 
    </Typography>
        <Grid container spacing={3} justifyContent="center">
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard product={product} addToCart={addToCart} />
            </Grid>
          ))}
        </Grid>
      </Container> */}
      {/* Đánh giá khách hàng */}
<Container sx={{ mt: 10, mb: 10 }}>
  <Typography
    variant="h4"
    fontWeight="bold"
    textAlign="center"
    sx={{
      background: "linear-gradient(90deg, #ec4899, #8b5cf6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      mb: 6,
    }}
  >
    Khách hàng nói gì về chúng tôi?
  </Typography>

  <Grid container spacing={4} justifyContent="center">
    {[
      {
        name: "Nguyễn Minh Thuý",
        feedback: "Hoa rất tươi và đẹp, giao hàng nhanh, dịch vụ tuyệt vời!",
        avatar: "/images/user1.jpg",
      },
      {
        name: "Trần Bảo Hân",
        feedback: "Tôi đã đặt hoa sinh nhật và bó hoa rất tinh tế, rất ưng ý!",
        avatar: "/images/user2.jpg",
      },
      {
        name: "Lê Quang Dũng",
        feedback: "Đặt hoa tặng mẹ, mẹ tôi rất thích. Màu sắc nhẹ nhàng, đúng ý!",
        avatar: "/images/user3.jpg",
      },
    ].map((user, idx) => (
      <Grid item xs={12} sm={6} md={4} key={idx}>
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            textAlign: "center",
            height: "100%",
          }}
        >
          <Image
            src={user.avatar}
            alt={user.name}
            width={80}
            height={80}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 16,
            }}
          />
          <Typography variant="body1" fontStyle="italic" sx={{ mb: 2 }}>
            "{user.feedback}"
          </Typography>
           {/* ⭐⭐⭐⭐⭐ */}
          <Box sx={{ color: "#FFD700", mb: 1 }}>
              {"★★★★★"}
          </Box>

          <Typography fontWeight="bold" color="">
             {user.name}
          </Typography>
        </Box>
      </Grid>
    ))}
  </Grid>
  
</Container>
    </>
  );
}
