import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import config from "../config/config";

export default function PropertyPage() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    config
      .get("/properties")
      .then((res) => setProperties(res.data))
      .catch((err) => console.error("Veri çekme hatası:", err));
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        İlan Listesi
      </Typography>
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Başlık</strong></TableCell>
              <TableCell><strong>Şehir</strong></TableCell>
              <TableCell><strong>İlçe</strong></TableCell>
              <TableCell><strong>Alan (m²)</strong></TableCell>
              <TableCell><strong>Fiyat (₺)</strong></TableCell>
              <TableCell><strong>Tür</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.title}</TableCell>
                <TableCell>{p.city}</TableCell>
                <TableCell>{p.district}</TableCell>
                <TableCell>{p.area}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>{p.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
