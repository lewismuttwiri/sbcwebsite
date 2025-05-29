export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  is_verified?: boolean;
  user_role: number;
  created_at?: string;
  updated_at?: string;
}
