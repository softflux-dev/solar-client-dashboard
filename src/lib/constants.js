// Maps a project's lifecycle stage to a completion percentage. Progress bars
// must always read from this map via the dashboard selectors — never from a
// hardcoded number stored in component state or seed data.
export const PROJECT_STAGE_PROGRESS = {
  requested: 10,
  quoted: 40,
  approved: 55,
  installation_scheduled: 65,
  installing: 75,
  commissioning: 90,
  completed: 100,
};
