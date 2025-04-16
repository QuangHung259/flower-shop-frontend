import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const getCategories = () => axios.get(`${API}/api/categories`);

export const createCategory = (data) =>
  axios.post(`${API}/api/categories`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const updateCategory = (id, data) =>
  axios.put(`${API}/api/categories/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const deleteCategory = (id) =>
  axios.delete(`${API}/api/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
