// components/ClientWrapper.jsx
"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();

  const hideFooterRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/admin",
    "/admin/categories",
    "/admin/contact",
    "/admin/orders",
    "/admin/products",
    "/admin/shipping",
    "/admin/users",
  ];
  const hideFooter = hideFooterRoutes.includes(pathname);

  return (
    <>
      <main style={{ flex: 1 }}>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}
