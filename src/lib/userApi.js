// lib/userApi.js
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

//Lấy token từ localStorage (chạy trên client)
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

//Header xác thực
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

//GET: Lấy danh sách người dùng
export const getUsers = () => axios.get(`${API}/api/users`, authHeader());

//PUT: Đổi vai trò user
// newRole: "admin" hoặc "customer"
export const toggleUserRole = (userId, newRole) =>
  axios.put(`${API}/api/users/${userId}/role`, { role: newRole }, authHeader());

//DELETE: Xoá user
export const deleteUser = (userId) =>
  axios.delete(`${API}/api/users/${userId}`, authHeader());
