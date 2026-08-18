import { createSlice } from "@reduxjs/toolkit";

// Projects only store their lifecycle `stage`. Completion percentage is
// derived later in dashboardSelectors via PROJECT_STAGE_PROGRESS — a raw
// percentage is never stored here.
const initialState = {
  activeProjects: [
    {
      id: 1,
      name: "10kW Residential System - DHA",
      code: "PRJ-8821",
      company: "SolarMax Pakistan",
      stage: "installing",
    },
    {
      id: 2,
      name: "15kW Residential System - Karachi",
      code: "PRJ-8823",
      company: "SolarMax Pakistan",
      stage: "installation_scheduled",
    },
    {
      id: 3,
      name: "11kW Residential System - Wah Cantt",
      code: "PRJ-8825",
      company: "SolarMax Pakistan",
      stage: "approved",
    },
  ],
  upcomingInstallations: [
    {
      id: 1,
      titleKey: "dashboard.upcoming.systemInstallation",
      companyName: "SolarMax Pakistan",
      date: "2023-05-25",
      time: "09:00",
    },
    {
      id: 2,
      titleKey: "dashboard.upcoming.systemInstallation",
      companyName: "EcoPower Solutions",
      date: "2023-06-01",
      time: "14:00",
    },
  ],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
});

export default projectsSlice.reducer;
