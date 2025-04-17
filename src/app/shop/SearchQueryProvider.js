// src/app/shop/SearchQueryProvider.js
"use client";

import { useSearchParams } from "next/navigation";

export default function SearchQuery({ children }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";

  return children(query);
}
