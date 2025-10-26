// ...existing code...
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Tooltip,
  IconButton,
  TextField,
  Button,
  TablePagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

import config from "../config/config";
import CustomerModal from "../components/CustomerModal";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [editData, setEditData] = useState(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    config
      .get("/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Veri çekme hatası:", err));
  }, []);

  const handleSaveCustomer = async (data) => {
    try {
      if (editData) {
        await config.put(`/customers/${editData.id}`, data);
      } else {
        await config.post("/customers", data);
      }
      const res = await config.get("/customers");
      setCustomers(res.data);
      setOpen(false);
      setEditData(null);
    } catch (err) {
      console.error("Kayıt işlemi hatası:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu müşteriyi silmek istediğine emin misin?")) {
      try {
        await config.delete(`/customers/${id}`);
        const res = await config.get("/customers");
        setCustomers(res.data);
      } catch (err) {
        console.error("Silme hatası:", err);
      }
    }
  };

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => {
      return (
        (c.name || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.phone || "").toLowerCase().includes(q) ||
        (c.address || "").toLowerCase().includes(q) ||
        (c.business?.name || "").toLowerCase().includes(q)
      );
    });
  }, [customers, filter]);

  const displayed = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box p={3}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h5">Müşteri Listesi ({customers.length})</Typography>
          <TextField
            size="small"
            placeholder="Müşteri ara..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(0);
            }}
          />
        </Box>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
            setEditData(null);
          }}
        >
          Yeni Müşteri Ekle
        </Button>
      </Box>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Ad</strong></TableCell>
              <TableCell><strong>Telefon</strong></TableCell>
              <TableCell><strong>E-posta</strong></TableCell>
              <TableCell><strong>Adres</strong></TableCell>
              <TableCell><strong>Bağlı olduğu iş yeri adı</strong></TableCell>
              <TableCell><strong>İşyeri Yetkilisi</strong></TableCell>
              <TableCell><strong>İşyeri Adresi</strong></TableCell>
              <TableCell><strong>İşyeri Telefon</strong></TableCell>
              <TableCell><strong>İşyeri Fax</strong></TableCell>
              <TableCell><strong>İşlemler</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayed.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.address}</TableCell>
                <TableCell>{c.business?.name || "-"}</TableCell>
                <TableCell>{c.business?.authorizedPerson || "-"}</TableCell>
                <TableCell>{c.business?.address || "-"}</TableCell>
                <TableCell>{c.business?.phone || "-"}</TableCell>
                <TableCell>{c.business?.fax || "-"}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Düzenle">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setEditData(c);
                        setOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton color="error" onClick={() => handleDelete(c.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      <CustomerModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditData(null);
        }}
        onSave={handleSaveCustomer}
        editData={editData}
      />
    </Box>
  );
}
// ...existing code...