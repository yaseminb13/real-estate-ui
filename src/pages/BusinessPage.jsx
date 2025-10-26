import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  CircularProgress,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import BusinessModal from "../components/BusinessModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from "../features/businesses/businessSlice";
import { toast } from "react-toastify";


const BusinessPage = () => {
  const dispatch = useDispatch();
  const { items: rows, loading } = useSelector((state) => state.businesses);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchBusinesses());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => (r.name || "").toLowerCase().includes(q));
  }, [rows, filter]);

const handleSaveBusiness = async (data) => {
  try {
    if (editData) {
      await dispatch(updateBusiness({ id: editData.id, data })).unwrap();
      toast.success("İşyeri başarıyla güncellendi!");
    } else {
      await dispatch(createBusiness(data)).unwrap();
      toast.success("Yeni işyeri başarıyla eklendi!");
    }
    setOpen(false);
    setEditData(null);
  } catch (err) {
    console.error("Kayıt işlemi hatası:", err);
    toast.error("Kayıt işlemi sırasında bir hata oluştu!");
  }
};


  const handleDelete = (row) => {
    setSelectedToDelete(row);
    setConfirmOpen(true);
  };
const confirmDelete = async () => {
  if (!selectedToDelete) return;
  try {
    await dispatch(deleteBusiness(selectedToDelete.id)).unwrap();
    toast.success("İşyeri başarıyla silindi!");
  } catch (err) {
    console.error("Silme hatası:", err);
    toast.error(
      "Silme işlemi başarısız! Bu işyerine bağlı müşteriler olabilir."
    );
  } finally {
    setConfirmOpen(false);
    setSelectedToDelete(null);
  }
};

  const cancelDelete = () => {
    setConfirmOpen(false);
    setSelectedToDelete(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Typography variant="h5">İşyeri Listesi ({rows.length})</Typography>
        <TextField
          label="İşyeri Ara"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={() => setOpen(true)}>
          Yeni İşyeri Ekle
        </Button>
      </Box>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>İşyeri Adı</strong>
              </TableCell>
              <TableCell>
                <strong>Yetkili</strong>
              </TableCell>
              <TableCell>
                <strong>Adres</strong>
              </TableCell>
              <TableCell>
                <strong>Telefon</strong>
              </TableCell>
              <TableCell>
                <strong>Fax</strong>
              </TableCell>
              <TableCell align="center">
                <strong>İşlemler</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.authorizedPerson}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.fax}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Düzenle">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditData(row);
                          setOpen(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(row)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog
        open={confirmOpen}
        onClose={cancelDelete}
        aria-labelledby="confirm-delete-title"
      >
        <DialogTitle id="confirm-delete-title">Silme Onayı</DialogTitle>
        <DialogContent>
          <DialogContentText>
            "{selectedToDelete?.name}" kaydını silmek istediğinize emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="inherit">
            Vazgeç
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={(e, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      <BusinessModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditData(null);
        }}
        onSave={handleSaveBusiness}
        editData={editData}
      />
    </Box>
  );
};

export default BusinessPage;
