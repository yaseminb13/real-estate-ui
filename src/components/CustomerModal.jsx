import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { fetchBusinesses } from "../features/businesses/businessSlice";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
};

const CustomerModal = ({ open, onClose, onSave, editData }) => {
  const dispatch = useDispatch();
  const { items: businesses, loading } = useSelector(
    (state) => state.businesses
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    workplaceId: "",
    authorizedPerson: "",
    workplaceAddress: "",
    workplacePhone: "",
    workplaceFax: "",
  });

  useEffect(() => {
    dispatch(fetchBusinesses());
  }, [dispatch]);

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        workplaceId: "",
        authorizedPerson: "",
        workplaceAddress: "",
        workplacePhone: "",
        workplaceFax: "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkplaceChange = (e) => {
    const selectedId = e.target.value;
    const selectedWorkplace = businesses.find((wp) => wp.id === selectedId);

    setForm((prev) => ({
      ...prev,
      workplaceId: selectedId,
      authorizedPerson: selectedWorkplace?.authorizedPerson || "",
      workplaceAddress: selectedWorkplace?.address || "",
      workplacePhone: selectedWorkplace?.phone || "",
      workplaceFax: selectedWorkplace?.fax || "",
    }));
  };

const handleSubmit = () => {
  if (!form.name.trim()) {
    alert("Ad ve Soyad zorunludur!");
    return;
  }

  // Backend'in beklediği formatta gönderim
  const payload = {
    name: form.name,
    email: form.email,
    phone: form.phone,
    address: form.address,
    business: {
      id: form.workplaceId,
    },
  };

  onSave(payload);
  onClose();
};


  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          {editData ? "Müşteri Güncelle" : "Yeni Müşteri Ekle"}
        </Typography>

        <TextField
          label="Adı"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Telefon"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="E-posta"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)}
          helperText={
            form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
              ? "Geçerli bir e-posta adresi giriniz"
              : ""
          }
        />


        <TextField
          label="Adres"
          name="address"
          value={form.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Bağlı olduğu iş yeri</InputLabel>
          <Select
            value={form.workplaceId}
            name="workplaceId"
            onChange={handleWorkplaceChange}
            disabled={loading}
          >
            {businesses.map((wp) => (
              <MenuItem key={wp.id} value={wp.id}>
                {wp.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="İşyeri Yetkilisi"
          name="authorizedPerson"
          value={form.authorizedPerson}
          fullWidth
          margin="normal"
          disabled
        />

        <TextField
          label="İşyeri Adresi"
          name="workplaceAddress"
          value={form.workplaceAddress}
          fullWidth
          margin="normal"
          disabled
        />

        <TextField
          label="İşyeri Telefonu"
          name="workplacePhone"
          value={form.workplacePhone}
          fullWidth
          margin="normal"
          disabled
        />

        <TextField
          label="İşyeri Fax"
          name="workplaceFax"
          value={form.workplaceFax}
          fullWidth
          margin="normal"
          disabled
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>
            Vazgeç
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editData ? "Güncelle" : "Ekle"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomerModal;
