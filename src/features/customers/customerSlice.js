import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../config/config";

export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await config.get("/customers");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createCustomer = createAsyncThunk(
  "customers/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await config.post("/customers", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customers/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await config.put(`/customers/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await config.delete(`/customers/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
   
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const idx = state.items.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      });
  },
});

export default customerSlice.reducer;
