import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  createProperty,
  updateProperty,
} from "../features/properties/propertySlice";
import { fetchBusinesses } from "../features/businesses/businessSlice";
import { toast } from "react-toastify";
import axios from "axios";

export default function PropertyModal({ open, handleClose, editData }) {
  const dispatch = useDispatch();
  const { items: businesses, loading } = useSelector(
    (state) => state.businesses
  );

  const [form, setForm] = useState({
    title: "",
    city: "",
    cityId: "",
    district: "",
    area: "",
    price: "",
    type: "",
    workplaceId: "",
    authorizedPerson: "",
    workplaceAddress: "",
    workplacePhone: "",
    workplaceFax: "",
    heatingType: "",
    roomCount: "",
    floorCount: "",
    currentFloor: "",
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
      if (!form.cityId) {
        setDistricts([]);
        return;
      }
      try {
        const res = await axios.get(
          `https://turkiyeapi.dev/api/v1/provinces/${form.cityId}`
        );
        setDistricts(res.data.data.districts || []);
      } catch (err) {
        console.error("İlçeler alınamadı:", err);
      }
    };
    fetchDistricts();
  }, [form.cityId]);

  useEffect(() => {
    dispatch(fetchBusinesses());
  }, [dispatch]);

  useEffect(() => {
    if (editData && cities.length > 0) {
      const foundCity = cities.find(
        (c) => c.name.toLowerCase() === editData.city?.toLowerCase()
      );
      const cityId = foundCity?.id || "";

      setForm({
        title: editData.title || "",
        city: editData.city || "",
        cityId,
        district: editData.district || "",
        area: editData.area || "",
        price: editData.price || "",
        type: editData.type || "",
        heatingType: editData.heatingType || "",
        roomCount: editData.roomCount || "",
        floorCount: editData.floorCount || "",
        currentFloor: editData.currentFloor || "",
        workplaceId: editData.business?.id || "",
        authorizedPerson: editData.business?.authorizedPerson || "",
        workplaceAddress: editData.business?.address || "",
        workplacePhone: editData.business?.phone || "",
        workplaceFax: editData.business?.fax || "",
      });
    } else if (!editData) {
      setForm({
        title: "",
        city: "",
        cityId: "",
        district: "",
        area: "",
        price: "",
        type: "",
        heatingType: "",
        roomCount: "",
        floorCount: "",
        currentFloor: "",
        workplaceId: "",
        authorizedPerson: "",
        workplaceAddress: "",
        workplacePhone: "",
        workplaceFax: "",
      });
    }
  }, [editData, cities]);

  const handleFormChange = (e) => {
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

  const handleSubmit = async () => {
    if (!form.title?.trim()) {
      toast.error("Başlık zorunludur.");
      return;
    }

    const selectedBusiness = businesses.find((b) => b.id === form.workplaceId);

    const payload = {
      title: form.title,
      type: form.type,
      city: form.city,
      district: form.district,
      price: form.price ? parseFloat(form.price) : null,
      area: form.area ? parseFloat(form.area) : null,
      heatingType: form.heatingType || null,
      roomCount: form.roomCount ? parseInt(form.roomCount) : null,
      floorCount: form.floorCount ? parseInt(form.floorCount) : null,
      currentFloor: form.currentFloor ? parseInt(form.currentFloor) : null,
      business: selectedBusiness
        ? {
            id: selectedBusiness.id,
            name: selectedBusiness.name,
            authorizedPerson: selectedBusiness.authorizedPerson,
            address: selectedBusiness.address,
            phone: selectedBusiness.phone,
            fax: selectedBusiness.fax,
          }
        : null,
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
            value={form.city ? JSON.stringify({ name: form.city, id: form.cityId }) : ""}
            onChange={(e) => {
              const selectedCity = JSON.parse(e.target.value);
              setForm((prev) => ({
                ...prev,
                city: selectedCity.name,
                cityId: selectedCity.id,
                district: "",
              }));
            }}
            fullWidth
          >
            {cities.map((city) => (
              <MenuItem
                key={city.id}
                value={JSON.stringify({ name: city.name, id: city.id })}
              >
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
            disabled={!form.cityId}
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
            label="Isınma Türü"
            name="heatingType"
            value={form.heatingType}
            onChange={handleFormChange}
            fullWidth
          />

          <TextField
            label="Oda Sayısı"
            name="roomCount"
            type="number"
            value={form.roomCount}
            onChange={handleFormChange}
            fullWidth
          />

          <TextField
            label="Kat Sayısı"
            name="floorCount"
            type="number"
            value={form.floorCount}
            onChange={handleFormChange}
            fullWidth
          />

          <TextField
            label="Bulunduğu Kat"
            name="currentFloor"
            type="number"
            value={form.currentFloor}
            onChange={handleFormChange}
            fullWidth
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
            disabled
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
