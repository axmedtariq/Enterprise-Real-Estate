import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/auth';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    twoFactorEnabled?: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    message: string | null;
    twoFactorRequired: boolean; // If login requires 2FA
    twoFactorSecret: string | null; // Temp secret for setup
    qrCodeUrl: string | null; // QR code for setup
}

const initialState: AuthState = {
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated: false,
    loading: false,
    error: null,
    message: null,
    twoFactorRequired: false,
    twoFactorSecret: null,
    qrCodeUrl: null,
};

// --- Thunks ---

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string; token?: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (err: any) {
            // Check if 2FA required
            if (err.response?.data?.require2FA) {
                return rejectWithValue({ require2FA: true, message: '2FA Token Required' });
            }
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('token');
    return null;
});

export const enable2FA = createAsyncThunk(
    'auth/enable2FA',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as { auth: AuthState };
            const config = {
                headers: { Authorization: `Bearer ${auth.token}` },
            };
            const response = await axios.post(`${API_URL}/2fa/enable`, {}, config);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to start 2FA setup');
        }
    }
);

export const verify2FA = createAsyncThunk(
    'auth/verify2FA',
    async (token: string, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as { auth: AuthState };
            const config = {
                headers: { Authorization: `Bearer ${auth.token}` },
            };
            const response = await axios.post(`${API_URL}/2fa/verify`, { token }, config);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to verify 2FA');
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to request password reset');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to reset password');
        }
    }
);

export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as { auth: AuthState };
            if (!auth.token) return rejectWithValue('No token');

            const config = {
                headers: { Authorization: `Bearer ${auth.token}` },
            };
            const response = await axios.get(`${API_URL}/me`, config);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to load user');
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Load User
            .addCase(loadUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload.user;
            })
            .addCase(loadUser.rejected, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                // Don't clear token immediately or do?
                // localStorage.removeItem('token'); // Optional
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.twoFactorRequired = false;
            })
            .addCase(login.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                if (action.payload?.require2FA) {
                    state.twoFactorRequired = true;
                    state.error = 'Please enter your 2FA code';
                } else {
                    state.error = action.payload as string;
                }
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.twoFactorRequired = false;
            })
            // Enable 2FA
            .addCase(enable2FA.fulfilled, (state, action) => {
                state.qrCodeUrl = action.payload.qrCodeUrl;
                state.twoFactorSecret = action.payload.secret;
            })
            // Verify 2FA (Enable finish)
            .addCase(verify2FA.fulfilled, (state) => {
                if (state.user) state.user.twoFactorEnabled = true;
                state.qrCodeUrl = null;
                state.twoFactorSecret = null;
                state.message = "2FA Enabled Successfully";
            })
            // Forgot Password
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.message = action.payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            // Reset Password
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearErrors } = authSlice.actions;
export default authSlice.reducer;
