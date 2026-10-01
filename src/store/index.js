import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/store/slices/authSlice";
import electricityReducer from "@/store/slices/electricitySlice";
import requestsReducer from "@/store/slices/requestsSlice";
import solarRequestsReducer from "@/store/slices/solarRequestsSlice";
import uiReducer from "@/store/slices/uiSlice";
import quotationsReducer from "@/store/slices/quotationsSlice";
import projectsReducer from "@/store/slices/projectsSlice";
import notificationsReducer from "@/store/slices/notificationsSlice";

export const store = configureStore({
  reducer: {
    electricity: electricityReducer,
    auth: authReducer,
    requests: requestsReducer,
    solarRequests: solarRequestsReducer,
    ui: uiReducer,
    quotations: quotationsReducer,
    projects: projectsReducer,
    notifications: notificationsReducer,
  },
});
