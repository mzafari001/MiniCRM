import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from '../../../+shared/services/customer.service';
import { Customer } from '../../../+shared/models/customer.model'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customers',
  imports: [RouterLink],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  private readonly customerService = inject(CustomerService);

  customers: Customer[] = [];
  isLoading = true;
  router: any;

  ngOnInit(): void {
    this.loadCustomers();
  }
  navigateToNewCustomer() {
    this.router.navigate(['/customers/new']);
  }
  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('خطا در دریافت لیست مشتریان:', err);
        this.isLoading = false;
      }
    });
  }
}
