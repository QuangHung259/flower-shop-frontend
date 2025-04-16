"use client";

import ThemeRegistry from "@/components/ThemeRegistry";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Các route không hiển thị footer
  const hideFooterRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
  ];
  const hideFooter = hideFooterRoutes.includes(pathname);

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
          <main style={{ flex: 1 }}>{children}</main>
          {!hideFooter && <Footer />}
        </ThemeRegistry>
      </body>
    </html>
  );
}
