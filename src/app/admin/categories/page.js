"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  IconButton,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import {
  getCategories,
  deleteCategory,
  updateCategory,
} from "@/lib/categoryApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CategoryListPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", description: "" });
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh mục.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Bạn chắc chắn muốn xoá?")) {
      try {
        await deleteCategory(id);
        fetchData();
      } catch (err) {
        setError("Lỗi khi xoá danh mục");
        console.error(err);
      }
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateCategory(id, editData);
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError("Cập nhật thất bại");
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Danh sách danh mục</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/admin/categories/create")}
        >
          Thêm danh mục
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {categories.map((cat) => (
          <Grid item xs={12} key={cat._id}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              {editingId === cat._id ? (
                <Box sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    value={editData.name}
                    label="Tên danh mục"
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={editData.description}
                    label="Mô tả"
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    margin="normal"
                  />
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleUpdate(cat._id)}
                    sx={{ mt: 1 }}
                  >
                    Lưu
                  </Button>
                </Box>
              ) : (
                <>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {cat.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {cat.description}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      onClick={() => {
                        setEditingId(cat._id);
                        setEditData({
                          name: cat.name,
                          description: cat.description,
                        });
                      }}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(cat._id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
