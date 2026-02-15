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
    };
}

const initialState: PropertyState = {
    properties: [],
    loading: false,
    error: null,
    filters: {
        type: 'buy',
    },
};

// Async Thunk for Fetching
export const fetchProperties = createAsyncThunk(
    'properties/fetch',
    async (filters: PropertyState['filters'], { rejectWithValue }) => {
        try {
            let url = `http://localhost:5000/api/v1/properties?category=${filters.type}`;
            if (filters.minPrice) url += `&minPrice=${filters.minPrice}`;
            if (filters.maxPrice) url += `&maxPrice=${filters.maxPrice}`;
            // Note: Backend currently doesn't support 'search' query param in this snippet, 
            // but we add it for future compatibility

            const { data } = await axios.get(url);
            return data.data; // Assuming backend returns { success: true, data: [...] }
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch properties');
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
                state.properties = action.payload;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters } = propertySlice.actions;
export default propertySlice.reducer;
