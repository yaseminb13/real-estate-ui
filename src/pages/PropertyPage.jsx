import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  TextField,
  IconButton,
  Stack,
  TablePagination,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

import {
  fetchProperties,
  deleteProperty,
} from "../features/properties/propertySlice";
import PropertyModal from "../components/PropertyModal";

export default function PropertyPage() {
  const dispatch = useDispatch();
  const { items: properties, loading } = useSelector(
    (state) => state.properties
  );

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const filteredProperties = useMemo(() => {
    if (!search.trim()) return properties;
    const q = search.toLowerCase();
    return properties.filter(
      (p) =>
        String(p.title || "").toLowerCase().includes(q) ||
        String(p.city || "").toLowerCase().includes(q) ||
        String(p.district || "").toLowerCase().includes(q)
    );
  }, [properties, search]);

  const displayedProperties = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredProperties.slice(start, end);
  }, [filteredProperties, page, rowsPerPage]);

  const openNewModal = () => {
    setEditData(null);
    setOpenModal(true);
  };

  const openEditModal = (prop) => {
    setEditData(prop);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditData(null);
  };

  const handleDeleteConfirmed = async () => {
    if (selectedProperty) {
      await dispatch(deleteProperty(selectedProperty.id));
      toast.success("İlan başarıyla silindi!");
      setConfirmOpen(false);
      setSelectedProperty(null);
    }
  };

  const handleDeleteClick = (prop) => {
    setSelectedProperty(prop);
    setConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedProperty(null);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">
          İlan Listesi ({filteredProperties.length})
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            placeholder="Ara (başlık, şehir, ilçe)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="contained" onClick={openNewModal}>
            Yeni İlan
          </Button>
        </Stack>
      </Stack>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Başlık</strong>
              </TableCell>
              <TableCell>
                <strong>Şehir</strong>
              </TableCell>
              <TableCell>
                <strong>İlçe</strong>
              </TableCell>
              <TableCell>
                <strong>Alan (m²)</strong>
              </TableCell>
              <TableCell>
                <strong>Fiyat (₺)</strong>
              </TableCell>
              <TableCell>
                <strong>Tür</strong>
              </TableCell>
              <TableCell align="center">
                <strong>İşlemler</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedProperties.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.title}</TableCell>
                <TableCell>{p.city}</TableCell>
                <TableCell>{p.district}</TableCell>
                <TableCell>{p.area}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>{p.type}</TableCell>

                {/* 🔹 İşlemler hücresi */}
                <TableCell align="center">
                  <Tooltip title="Düzenle">
                    <IconButton color="primary" onClick={() => openEditModal(p)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton color="error" onClick={() => handleDeleteClick(p)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {displayedProperties.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {loading ? "Yükleniyor..." : "Kayıt bulunamadı."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredProperties.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <PropertyModal
        open={openModal}
        handleClose={closeModal}
        editData={editData}
      />

      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Silme Onayı</DialogTitle>
        <DialogContent>
          <Typography>
            Bu ilanı silmek istediğinize emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">
            Vazgeç
          </Button>
          <Button onClick={handleDeleteConfirmed} color="error" variant="contained">
            Evet, Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
