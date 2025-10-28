import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { createProperty, updateProperty } from "../features/properties/propertySlice";
import { toast } from "react-toastify";
import axios from "axios";

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

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get("https://turkiyeapi.dev/api/v1/provinces");
        setCities(res.data.data);
      } catch (err) {
        console.error("Şehirler alınamadı:", err);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!form.city) {
        setDistricts([]);
        return;
      }
      try {
        const res = await axios.get(
          `https://turkiyeapi.dev/api/v1/provinces/${form.city}`
        );
        setDistricts(res.data.data.districts || []);
      } catch (err) {
        console.error("İlçeler alınamadı:", err);
      }
    };
    fetchDistricts();
  }, [form.city]);

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
          <TextField
            label="Başlık"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            fullWidth
          />

          <TextField
            select
            label="Şehir"
            name="city"
            value={form.city}
            onChange={(e) => {
              handleFormChange(e);
              setForm((prev) => ({ ...prev, district: "" })); 
            }}
            fullWidth
          >
            {cities.map((city) => (
              <MenuItem key={city.id} value={city.id}>
                {city.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="İlçe"
            name="district"
            value={form.district}
            onChange={handleFormChange}
            fullWidth
            disabled={!form.city}
          >
            {districts.map((d) => (
              <MenuItem key={d.id} value={d.name}>
                {d.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Alan (m²)"
            name="area"
            type="number"
            value={form.area}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            label="Fiyat (₺)"
            name="price"
            type="number"
            value={form.price}
            onChange={handleFormChange}
            fullWidth
          />

          <TextField
            select
            label="Tür"
            name="type"
            value={form.type}
            onChange={handleFormChange}
            fullWidth
          >
            <MenuItem value="Satılık">Satılık</MenuItem>
            <MenuItem value="Kiralık">Kiralık</MenuItem>
          </TextField>

          <TextField
            label="Açıklama"
            name="description"
            value={form.description}
            onChange={handleFormChange}
            fullWidth
            multiline
            rows={3}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Vazgeç
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {editData ? "Güncelle" : "Ekle"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
