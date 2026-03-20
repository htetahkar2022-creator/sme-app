export interface InventoryItem {
  id: string;
  item_name: string;
  price: number;
  stock: number;
  user_id: string;
  created_at: string;
}

export interface FinanceRecord {
  id: string;
  type: 'Income' | 'Expense';
  amount: number;
  description: string;
  user_id: string;
  created_at: string;
}

export interface CreditRecord {
  id: string;
  customer_name: string;
  balance: number;
  user_id: string;
  created_at: string;
}

export interface CartItem extends InventoryItem {
  quantity: number;
}
