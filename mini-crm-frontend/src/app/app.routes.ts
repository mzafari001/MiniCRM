import { Routes } from '@angular/router';
import { CustomersComponent } from './+components/+pages/customers/ui/customers.component';
import { CustomerComponent } from './+components/+pages/customers/ui/customer/ui/customer.component';

export const routes: Routes = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  { path: 'customers', component: CustomersComponent },
  { path: 'customers/:id', component: CustomerComponent },
];
