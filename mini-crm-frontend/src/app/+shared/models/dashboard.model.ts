import { CustomerStatus } from "./customer-status.enum";

export interface RecentCustomer {
  id: number;
  fullName: string;
  phone?: string | null;
  company?: string | null;
  status: CustomerStatus;
  createdAt: string;
}

export interface DashboardSummary {
  totalCustomers: number;
  leadsCount: number;
  activeCount: number;
  inactiveCount: number;
  newCustomersLast7Days: number;
  recentCustomers: RecentCustomer[];
}
export { CustomerStatus };

