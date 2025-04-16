// app/admin/shipping/page.js
"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { getAllShipping, deleteShipping } from "@/lib/shippingApi";

const ShippingList = () => {
  const [shippings, setShippings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchShippings();
  }, []);

  const fetchShippings = async () => {
    try {
      const res = await getAllShipping();
      setShippings(res.data.shippings);
    } catch (err) {
      console.error("Lỗi khi load shipping:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa thật không?")) return;
    try {
      await deleteShipping(id);
      fetchShippings();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "-";
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Danh sách vận chuyển</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/admin/shipping/create")}
        >
          + Tạo vận chuyển
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã đơn</TableCell>
            <TableCell>Hãng</TableCell>
            <TableCell>Mã theo dõi</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Dự kiến giao</TableCell>
            <TableCell>Giao thực tế</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shippings.map((s) => (
            <TableRow key={s._id}>
              <TableCell>{s.order._id}</TableCell>
              <TableCell>{s.carrier}</TableCell>
              <TableCell>{s.trackingNumber}</TableCell>
              <TableCell>{s.status}</TableCell>
              <TableCell>{formatDate(s.estimatedDelivery)}</TableCell>
              <TableCell>{formatDate(s.actualDelivery)}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button
                    onClick={() => router.push(`/admin/shipping/edit/${s._id}`)}
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    Sửa
                  </Button>
                  <Button
                    onClick={() => handleDelete(s._id)}
                    variant="contained"
                    color="error"
                    size="small"
                  >
                    Xóa
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ShippingList;
