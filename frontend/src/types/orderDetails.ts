// frontend/src/types/order.ts
export interface OrderDetails {
  id: string;
  user_name: string;
  user_email: string;
  deliveryAddress: string;
  phone_number: string;
  city: string;
  order_notes?: string;
  items: Array<{
    image: string;
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}
