// app/layout.js
import ThemeRegistry from "@/components/ThemeRegistry";
import "./globals.css";  // Thêm các file CSS toàn cục
import ClientWrapper from "@/components/ClientWrapper";  // Import ClientWrapper

export const metadata = {
  title: "Floral Haven",
  description: "Trang web bán hoa trực tuyến",
  icons: {
    icon: "/Favicon.png", // Đường dẫn favicon
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <ThemeRegistry>
          <ClientWrapper>{children}</ClientWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
