import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: true, // desktop collapse state
  mobileSidebarOpen: false,
  theme: "light", // light | dark
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setMobileSidebarOpen(state, action) {
      state.mobileSidebarOpen = action.payload;
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
  },
});

export const { toggleSidebar, setMobileSidebarOpen, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
