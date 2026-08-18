import { createSlice } from "@reduxjs/toolkit";

// Notifications back both the topbar bell badge/menu and the dashboard
// "Recent Notifications" card. `icon` resolves to a lucide icon in the
// consuming components; `titleKey` keeps titles translatable.
const initialState = {
  list: [
    {
      id: 1,
      icon: "check",
      titleKey: "dashboard.notifications.quotationApproved",
      type: "document_signature",
      dueDate: "2023-10-12",
    },
    {
      id: 2,
      icon: "wallet",
      titleKey: "dashboard.notifications.paymentDue",
      type: "quotation_approval",
      dueDate: "2023-10-15",
    },
  ],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
});

export default notificationsSlice.reducer;
