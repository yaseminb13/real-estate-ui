import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import axios from "axios";

const PropertySearch = () => {
  // Form state
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");

  // Results
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Fetch filtered properties
  const handleSearch = async () => {
    try {
      const params = {
        type,
        city,
        district,
        minPrice,
        maxPrice,
        minArea,
        maxArea,
      };

      // Remove empty values
      Object.keys(params).forEach(
        (key) => (params[key] === "" || params[key] === null) && delete params[key]
      );
const res = await axios.get("http://localhost:8080/properties", { params });
      setProperties(res.data);
    } catch (err) {
      console.error("Arama hatası:", err);
    }
  };

  // Yazdırma fonksiyonu
  const handlePrint = (property) => {
    setSelectedProperty(property);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Emlak Arama
      </Typography>

      {/* Arama Formu */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <TextField
          select
          label="Tür"
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ minWidth: 120 }}
        >
          <MenuItem value="">Tümü</MenuItem>
          <MenuItem value="Satılık">Satılık</MenuItem>
          <MenuItem value="Kiralık">Kiralık</MenuItem>
        </TextField>

        <TextField
          label="Şehir"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <TextField
          label="İlçe"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        />
        <TextField
          label="Min Fiyat"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <TextField
          label="Max Fiyat"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <TextField
          label="Min Metrekare"
          type="number"
          value={minArea}
          onChange={(e) => setMinArea(e.target.value)}
        />
        <TextField
          label="Max Metrekare"
          type="number"
          value={maxArea}
          onChange={(e) => setMaxArea(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Ara
        </Button>
      </Box>

      {/* Sonuç Tablosu */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Başlık</TableCell>
              <TableCell>Tür</TableCell>
              <TableCell>Şehir</TableCell>
              <TableCell>İlçe</TableCell>
              <TableCell>Fiyat</TableCell>
              <TableCell>Metrekare</TableCell>
              <TableCell>İşletme</TableCell>
              <TableCell>İşlem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((prop) => (
              <TableRow key={prop.id}>
                <TableCell>{prop.title}</TableCell>
                <TableCell>{prop.type}</TableCell>
                <TableCell>{prop.city}</TableCell>
                <TableCell>{prop.district}</TableCell>
                <TableCell>{prop.price}</TableCell>
                <TableCell>{prop.area}</TableCell>
                <TableCell>{prop.business?.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handlePrint(prop)}
                  >
                    Yazdır
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Yazdırılacak detay */}
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

