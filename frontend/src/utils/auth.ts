// utils/auth.ts
import { jwtDecode } from "jwt-decode";
export function decodeToken(token?: string | null) {
  try {
    if (!token) return null;
    return jwtDecode<{
      email: string;
      userId: string;
      role?: string;
    }>(token);
  } catch {
    return null;
  }
}
