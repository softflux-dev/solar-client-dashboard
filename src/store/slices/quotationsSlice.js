import { createSlice } from "@reduxjs/toolkit";

// Seed quotations matching the reference dashboard: 1 awaiting decision,
// 2 approved, 1 pending. `status` drives the derived stat-card counts and
// the Pending Approvals list — no numbers are hardcoded in components.
const initialState = {
  list: [
    {
      id: 1,
      title: "10kW System Quotation — SolarMax Pakistan",
      type: "document_signature",
      status: "awaiting_decision",
      dueDate: "2023-10-12",
    },
    {
      id: 2,
      title: "15kW System Quotation — SolarMax Pakistan",
      type: "quotation_approval",
      status: "approved",
      dueDate: "2023-10-15",
    },
    {
      id: 3,
      title: "5kW System Quotation — EcoPower Solutions",
      type: "quotation_approval",
      status: "approved",
      dueDate: "2023-10-18",
    },
    {
      id: 4,
      title: "11kW System Quotation — SolarOne",
      type: "document_signature",
      status: "pending",
      dueDate: "2023-10-20",
    },
  ],
};

const quotationsSlice = createSlice({
  name: "quotations",
  initialState,
  reducers: {},
});

export default quotationsSlice.reducer;
