import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { createProperty, updateProperty } from "../features/properties/propertySlice";
import { toast } from "react-toastify";

export default function PropertyModal({ open, handleClose, editData }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: "",
    city: "",
    district: "",
    area: "",
    price: "",
    type: "",
    description: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        city: editData.city || "",
        district: editData.district || "",
        area: editData.area || "",
        price: editData.price || "",
        type: editData.type || "",
        description: editData.description || "",
      });
    } else {
      setForm({
        title: "",
        city: "",
        district: "",
        area: "",
        price: "",
        type: "",
        description: "",
      });
    }
  }, [editData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title?.trim()) {
      toast.error("Başlık zorunludur.");
      return;
    }

    const payload = {
      ...form,
      area: form.area ? parseFloat(form.area) : null,
      price: form.price ? parseFloat(form.price) : null,
    };

    try {
      if (editData) {
        await dispatch(updateProperty({ id: editData.id, data: payload }));
        toast.success("İlan başarıyla güncellendi!");
      } else {
        await dispatch(createProperty(payload));
        toast.success("İlan başarıyla eklendi!");
      }
      handleClose();
    } catch (err) {
      toast.error("İşlem başarısız: " + (err?.message || ""));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editData ? "İlanı Güncelle" : "Yeni İlan Ekle"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Başlık" name="title" value={form.title} onChange={handleFormChange} fullWidth />
          <TextField label="Şehir" name="city" value={form.city} onChange={handleFormChange} fullWidth />
          <TextField label="İlçe" name="district" value={form.district} onChange={handleFormChange} fullWidth />
          <TextField label="Alan (m²)" name="area" type="number" value={form.area} onChange={handleFormChange} fullWidth />
          <TextField label="Fiyat (₺)" name="price" type="number" value={form.price} onChange={handleFormChange} fullWidth />
          <TextField label="Tür" name="type" value={form.type} onChange={handleFormChange} fullWidth />
          <TextField label="Açıklama" name="description" value={form.description} onChange={handleFormChange} fullWidth multiline rows={3} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">Vazgeç</Button>
        <Button variant="contained" onClick={handleSubmit}>{editData ? "Güncelle" : "Ekle"}</Button>
      </DialogActions>
    </Dialog>
  );
}