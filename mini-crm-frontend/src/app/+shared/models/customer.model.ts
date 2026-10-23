export interface Customer {
  id: number;
  fullName: string;
  email: string | null;
  phone: string;
  company: string | null;
  status: number;
  createdAt: string;
  userId: number | null;
}
export type CreateCustomer = Omit<Customer, 'id' | 'createdAt' | 'userId'>;
