export interface OrderItemProduct {
  id: string;
  name: string;
  image?: string;
  price: number;
  sku?: string;
}

export interface OrderItem {
  id: string;
  product: OrderItemProduct;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "completed"
    | "cancelled";
  total_amount: number;
  shipping_address: {
    first_name: string;
    last_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  billing_address?: {
    first_name: string;
    last_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  payment_method: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  tracking_number?: string;
  tracking_url?: string;
  shipping_method?: string;
  shipping_cost?: number;
  tax_amount?: number;
  discount_amount?: number;
  notes?: string;
}

// address
// :
// "252"
// city
// :
// "Nairobi"
// created_at
// :
// "2025-05-22T19:19:18.151754Z"
// email
// :
// "danquake2019@gmail.com"
// id
// :
// 32
// items
// :
// []
// name
// :
// "Duncan Macharia"
// order_notes
// :
// ""
// phone_number
// :
// "0757738641"
// status
// :
// "pending"
// status_display
// :
// "Pending"
// total_price
// :
// "1350.00"
// updated_at
// :
// "2025-05-22T19:19:18.152594Z"
// user
// :
// 18
// user_email
// :
// "danquake2019@gmail.com"
// user_name
// :
// "Duncan Macharia"
// [[Prototype]]
// :
// Object
