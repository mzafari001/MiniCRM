import { Routes } from '@angular/router';
import { CustomerComponent } from './+pages/customers/ui/customer/ui/customer.component';
import { CustomersComponent } from './+pages/customers/ui/customers.component';
import { DashboardComponent } from './+pages/dashboard/dashboard.component';
import { LayoutComponent } from './+components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./+pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./+pages/customers/ui/customers.component').then(m => m.CustomersComponent)
      },
      {
        path: 'customers/new',
        loadComponent: () =>
          import('./+pages/customers/ui/customer/ui/customer.component').then(m => m.CustomerComponent)
      },
      {
        path: 'customers/:id',
        loadComponent: () =>
          import('./+pages/customers/ui/customer/ui/customer.component').then(m => m.CustomerComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
