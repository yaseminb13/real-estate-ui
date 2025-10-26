import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../config/config";

export const fetchBusinesses = createAsyncThunk(
  "businesses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await config.get("/businesses");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createBusiness = createAsyncThunk(
  "businesses/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await config.post("/businesses", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateBusiness = createAsyncThunk(
  "businesses/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await config.put(`/businesses/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteBusiness = createAsyncThunk(
  "businesses/delete",
  async (id, { rejectWithValue }) => {
    try {
      await config.delete(`/businesses/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const businessSlice = createSlice({
  name: "businesses",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteBusiness.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export default businessSlice.reducer;