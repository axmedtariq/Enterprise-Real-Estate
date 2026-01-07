// frontend/src/store/slices/propertySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getAllProperties = createAsyncThunk('properties/all', async (query) => {
  const { data } = await axios.get(`/api/v1/properties?${query}`);
  return data;
});

const propertySlice = createSlice({
  name: 'properties',
  initialState: { properties: [], loading: false },
  extraReducers: (builder) => {
    builder.addCase(getAllProperties.pending, (state) => { state.loading = true; });
    builder.addCase(getAllProperties.fulfilled, (state, action) => {
      state.loading = false;
      state.properties = action.payload.properties;
    });
  }
});