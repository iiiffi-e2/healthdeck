export function useMockHealthData(): boolean {
  if (process.env.USE_MOCK_HEALTH_DATA === "false") return false;
  if (process.env.GOOGLE_HEALTH_API_ENABLED === "true") return false;
  return true;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
