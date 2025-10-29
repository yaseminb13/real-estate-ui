import { useState, useMemo } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "../features/properties/propertySlice";

const PropertySearch = () => {
  const dispatch = useDispatch();
  const { items: properties, loading } = useSelector((state) => state.properties);

  const [filters, setFilters] = useState({
    type: "",
    city: "",
    district: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
  });

  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "" && v !== null)
    );
    dispatch(fetchProperties(cleanFilters));
  };

  const handlePrint = (property) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>İlan Detayı</title></head><body>");
    printWindow.document.write(`<h2>${property.title}</h2>`);
    printWindow.document.write(`<p>Tür: ${property.type}</p>`);
    printWindow.document.write(`<p>Şehir: ${property.city}</p>`);
    printWindow.document.write(`<p>İlçe: ${property.district}</p>`);
    printWindow.document.write(`<p>Alan: ${property.area} m²</p>`);
    printWindow.document.write(`<p>Isıtma Türü: ${property.heatingType}</p>`);
    printWindow.document.write(`<p>Oda Sayısı: ${property.roomCount}</p>`);
    printWindow.document.write(`<p>Kat Sayısı: ${property.floorCount}</p>`);
    printWindow.document.write(`<p>Bulunduğu Kat: ${property.currentFloor}</p>`);
    printWindow.document.write(`<p>Fiyat: ${property.price} ₺</p>`);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const isEmpty = useMemo(() => !loading && properties.length === 0, [loading, properties]);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        🏡 Emlak Arama
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <TextField
          select
          label="Tür"
          name="type"
          value={filters.type}
          onChange={handleChange}
          style={{ minWidth: 150 }}
        >
          <MenuItem value="">Tümü</MenuItem>
          <MenuItem value="Satılık">Satılık</MenuItem>
          <MenuItem value="Kiralık">Kiralık</MenuItem>
        </TextField>

        <TextField label="Şehir" name="city" value={filters.city} onChange={handleChange} />
        <TextField label="İlçe" name="district" value={filters.district} onChange={handleChange} />
        <TextField label="Min Fiyat" name="minPrice" type="number" value={filters.minPrice} onChange={handleChange} />
        <TextField label="Max Fiyat" name="maxPrice" type="number" value={filters.maxPrice} onChange={handleChange} />
        <TextField label="Min m²" name="minArea" type="number" value={filters.minArea} onChange={handleChange} />
        <TextField label="Max m²" name="maxArea" type="number" value={filters.maxArea} onChange={handleChange} />

        <Button variant="contained" color="primary" onClick={handleSearch}>
          Ara
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      )}

      {isEmpty && (
        <Typography color="text.secondary" mt={2}>
          Kriterlere uygun emlak bulunamadı.
        </Typography>
      )}

      {!loading && properties.length > 0 && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Başlık</strong></TableCell>
                <TableCell><strong>Tür</strong></TableCell>
                <TableCell><strong>Şehir</strong></TableCell>
                <TableCell><strong>İlçe</strong></TableCell>
                <TableCell><strong>Fiyat</strong></TableCell>
                <TableCell><strong>Metrekare</strong></TableCell>
                <TableCell><strong>İşyeri</strong></TableCell>
                <TableCell><strong>İşlem</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {properties.map((prop) => (
                <TableRow key={prop.id} hover>
                  <TableCell>{prop.title}</TableCell>
                  <TableCell>{prop.type}</TableCell>
                  <TableCell>{prop.city}</TableCell>
                  <TableCell>{prop.district}</TableCell>
                  <TableCell>{prop.price}</TableCell>
                  <TableCell>{prop.area}</TableCell>
                  <TableCell>{prop.business?.name}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handlePrint(prop)}>
                      Yazdır
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {selectedProperty && (
        <Box display="none">
          <Typography variant="h6">Emlak Detayları</Typography>
          <Typography>Başlık: {selectedProperty.title}</Typography>
          <Typography>Tür: {selectedProperty.type}</Typography>
          <Typography>Şehir: {selectedProperty.city}</Typography>
          <Typography>İlçe: {selectedProperty.district}</Typography>
          <Typography>Fiyat: {selectedProperty.price}</Typography>
          <Typography>Metrekare: {selectedProperty.area}</Typography>
          <Typography>İşletme: {selectedProperty.business?.name}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default PropertySearch;