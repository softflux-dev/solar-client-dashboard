import Api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

// Logs a customer in. Returns the `data` field from the API response:
// { token: string, user: { id, fullName, email, phone, userType } }
export async function loginCustomer(credentials) {
  const response = await Api.post(ENDPOINTS.auth.customerLogin, credentials);
  return response.data.data;
}
