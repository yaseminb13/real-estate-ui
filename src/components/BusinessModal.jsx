import { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

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

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
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

    const formattedForm = {
      ...form,
      phone: form.phone.replace(/\D/g, ""), 
      fax: form.fax.replace(/\D/g, ""),
    };

    onSave(formattedForm);
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

        <TextField
          label="Telefon"
          name="phone"
          value={form.phone}
          onChange={(e) => {
            const val = e.target.value.replace(/[^\d]/g, "");
            setForm((prev) => ({ ...prev, phone: val }));
          }}
          placeholder="05551234567"
          fullWidth
          margin="normal"
        />

        <TextField
          label="Fax"
          name="fax"
          value={form.fax}
          onChange={(e) => {
            const val = e.target.value.replace(/[^\d]/g, "");
            setForm((prev) => ({ ...prev, fax: val }));
          }}
          placeholder="05551234567"
          fullWidth
          margin="normal"
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

export default BusinessModal;
