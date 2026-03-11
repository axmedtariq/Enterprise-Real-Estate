import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define Types
export interface Property {
    id: string;
    title: string;
    price: number;
    address: string;
    category: 'buy' | 'rent';
    images: { url: string }[];
    isVIP: boolean;
    has3D: boolean;
}

interface PropertyState {
    properties: Property[];
    loading: boolean;
    error: string | null;
    filters: {
        type: 'buy' | 'rent';
        minPrice?: number;
        maxPrice?: number;
        search?: string;
        page?: number;
        limit?: number;
    };
    totalPages: number;
    currentPage: number;
}

const initialState: PropertyState = {
    properties: [],
    loading: false,
    error: null,
    filters: {
        type: 'buy',
        page: 1,
        limit: 9,
    },
    totalPages: 1,
    currentPage: 1,
};

// Async Thunk for Fetching
export const fetchProperties = createAsyncThunk(
    'properties/fetch',
    async (filters: PropertyState['filters'], { rejectWithValue }) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
            let url = `${API_URL}/properties?category=${filters.type}`;
            if (filters.minPrice) url += `&minPrice=${filters.minPrice}`;
            if (filters.maxPrice) url += `&maxPrice=${filters.maxPrice}`;
            if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
            if (filters.page) url += `&page=${filters.page}`;
            if (filters.limit) url += `&limit=${filters.limit}`;

            console.log(`🔍 Sovereign Dispatch: Fetching assets from ${url}`);
            const { data } = await axios.get(url);
            console.log(`✅ Sovereign Success: Received ${data.count || data.length} assets`);
            return data; // Return full response body containing pagination data
        } catch (err: any) {
            console.error('❌ Sovereign Link Error:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch properties';
            return rejectWithValue(errorMessage);
        }
    }
);

const propertySlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<PropertyState['filters']>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProperties.fulfilled, (state, action) => {
                state.loading = false;
                state.properties = action.payload.data;
                state.totalPages = action.payload.totalPages || 1;
                state.currentPage = action.payload.currentPage || 1;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters } = propertySlice.actions;
export default propertySlice.reducer;
