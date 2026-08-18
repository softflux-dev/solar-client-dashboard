import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "solar-auth";

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, isAuthenticated: true }),
    );
  } catch {
    // storage unavailable — session simply won't survive a reload
  }
}

function clearStoredAuth() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

const storedAuth = loadStoredAuth();

const initialState = {
  user: storedAuth?.user ?? null, // { id, name, email, avatarUrl }
  isAuthenticated: storedAuth?.isAuthenticated ?? false,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.status = "loading";
      state.error = null;
    },
    loginSuccess(state, action) {
      state.status = "succeeded";
      state.user = action.payload;
      state.isAuthenticated = true;
      persistAuth(action.payload);
    },
    loginFailure(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      clearStoredAuth();
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
