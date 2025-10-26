import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import InputMask from "react-input-mask";

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

const BusinessModal = ({ open, onClose, onSave, editData }) => {
  const [form, setForm] = useState({
    name: "",
    authorizedPerson: "",
    address: "",
    phone: "",
    fax: "",
  });

  // Eğer editData varsa formu doldur
  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      // Yeni kayıt ekleme moduna geçtiyse formu sıfırla
      setForm({
        name: "",
        authorizedPerson: "",
        address: "",
        phone: "",
        fax: "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert("İşyeri adı zorunludur!");
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          {editData ? "İşyeri Güncelle" : "Yeni İşyeri Ekle"}
        </Typography>

        <TextField
          label="İşyeri Adı"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Yetkili Kişi"
          name="authorizedPerson"
          value={form.authorizedPerson}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Adres"
          name="address"
          value={form.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
 <InputMask
  mask="+90 (999) 999 99 99"
  value={form.phone || ""}
  onChange={handleChange}
>
  {() => (
    <TextField
      fullWidth
      label="Telefon"
      name="phone"
      variant="outlined"
      margin="normal"
    />
  )}
</InputMask>
<InputMask
  mask="+90 (999) 999 99 99"
  value={form.fax || ""}
  onChange={handleChange}
>
  {() => (
    <TextField
      fullWidth
      label="Fax"
      name="fax"
      variant="outlined"
      margin="normal"
    />
  )}
</InputMask>

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

export default BusinessModal;
