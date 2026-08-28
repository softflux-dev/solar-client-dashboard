import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { loginCustomer } from "@/api/services/customerAuth";
import { TOKEN_KEY } from "@/api/axios";

const STORAGE_KEY = "solar-auth";

// ─── Token helpers ────────────────────────────────────────────────────────────
function saveToken(token) {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // sessionStorage unavailable — requests will simply not be authorised.
  }
}

function clearToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

// ─── Restore auth from a previous session ────────────────────────────────────
function loadStoredAuth() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.user && parsed?.isAuthenticated) return parsed;
    return null;
  } catch {
    return null;
  }
}

function persistAuth(user) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, isAuthenticated: true }),
    );
  } catch {
    // ignore
  }
}

function clearStoredAuth() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

const storedAuth = loadStoredAuth();

const initialState = {
  user: storedAuth?.user ?? null, // { id, fullName, email, phone, userType }
  isAuthenticated: storedAuth?.isAuthenticated ?? false,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

// ─── Thunk: call the customer login service ──────────────────────────────────
export const loginCustomerAsync = createAsyncThunk(
  "auth/loginCustomer",
  async (credentials, { rejectWithValue }) => {
    try {
      const { token, user } = await loginCustomer(credentials);
      saveToken(token);
      return user;
    } catch (error) {
      const message =
        error.response?.data?.message ?? "Login failed. Please try again.";
      return rejectWithValue(message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      clearToken();
      clearStoredAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginCustomerAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginCustomerAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        persistAuth(action.payload);
      })
      .addCase(loginCustomerAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
