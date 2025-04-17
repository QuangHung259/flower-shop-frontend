// lib/orderApi.js
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

const token = () =>
  typeof window !== "undefined" && localStorage.getItem("token");

export const getOrders = () =>
  axios.get(`${API}/api/orders`, {
    headers: { Authorization: `Bearer ${token()}` },
  });

export const getOrderById = (id) =>
  axios.get(`${API}/api/orders/${id}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });

export const deleteOrder = (id) =>
  axios.delete(`${API}/api/orders/${id}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });

export const updateOrderStatus = (id, status) =>
  axios.put(
    `${API}/api/orders/${id}`,
    { status },
    {
      headers: { Authorization: `Bearer ${token()}` },
    }
  );
