import { Routes } from '@angular/router';
import { CustomerComponent } from './+pages/customers/ui/customer/ui/customer.component';
import { CustomersComponent } from './+pages/customers/ui/customers.component';
import { DashboardComponent } from './+pages/dashboard/dashboard.component';
export const routes: Routes = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  { path: 'customers', component: CustomersComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'customers/:id', component: CustomerComponent },
];
