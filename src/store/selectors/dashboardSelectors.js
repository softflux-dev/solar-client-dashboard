import { PROJECT_STAGE_PROGRESS } from "@/lib/constants";

// Derived dashboard statistics. Counts are always computed from the
// quotations list's `status` field — never hardcoded.
export const selectQuotationStats = (state) => {
  const quotations = state.quotations.list;
  return {
    total: quotations.length,
    approved: quotations.filter((q) => q.status === "approved").length,
    awaitingDecision: quotations.filter((q) => q.status === "awaiting_decision").length,
  };
};

// Active projects mapped with a completion percentage looked up from
// PROJECT_STAGE_PROGRESS[project.stage]. Falls back to 0 for unknown stages.
export const selectActiveProjectsWithProgress = (state) =>
  state.projects.activeProjects.map((project) => ({
    ...project,
    progress: PROJECT_STAGE_PROGRESS[project.stage] ?? 0,
  }));

// Count of active projects — the "Installation Progress" stat card value.
export const selectInstallationProgressCount = (state) =>
  state.projects.activeProjects.length;
