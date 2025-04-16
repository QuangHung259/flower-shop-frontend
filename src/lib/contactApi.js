// lib/contactApi.js
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Lấy tất cả liên hệ (chỉ admin)
export const getAllContacts = () =>
  axios.get(`${API}/api/contact`, authHeader());
