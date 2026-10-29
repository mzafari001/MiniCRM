
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateCustomer, Customer } from '../models/customer.model';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly backend = inject(BackendService);
  private readonly endpoint = '/api/v1/customers';

  getCustomers(): Observable<Customer[]> {
    return this.backend.get<Customer[]>(`${this.endpoint}/list`);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.backend.get<Customer>(`${this.endpoint}/details/${id}`);
  }

  createCustomer(customer: CreateCustomer): Observable<any> {
    return this.backend.post<any>(`${this.endpoint}/api/v1/create`, customer);
  }

  updateCustomer(id: number, customer: Partial<Customer>): Observable<any> {
    return this.backend.put<any>(`${this.endpoint}/update/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.backend.delete<any>(`${this.endpoint}/remove/${id}`);
  }
}

// import { HttpClient } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { CreateCustomer, Customer } from '../models/customer.model';
// import { BackendService } from './backend.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class CustomerService {
//   private readonly backend = inject(BackendService);
//   private readonly endpoint = '/api/v1/customers';

//   // دریافت لیست مشتریان (متصل به /api/v1/customers/list)
//   getCustomers(): Observable<Customer[]> {
//     return this.backend.get<Customer[]>(`${this.endpoint}/list`);
//   }

//   // دریافت جزئیات یک مشتری (متصل به /api/v1/customers/details/{id})
//   getCustomerById(id: number): Observable<Customer> {
//     return this.backend.get<Customer>(`${this.endpoint}/details/${id}`);
//   }

//   // ایجاد مشتری جدید (متصل به /api/v1/customers/create)
//   createCustomer(customer: CreateCustomer): Observable<any> {
//     return this.backend.post<any>(`${this.endpoint}/create`, customer);
//   }

//   // ویرایش مشتری (متصل به /api/v1/customers/update/{id})
//   updateCustomer(id: number, customer: Partial<Customer>): Observable<any> {
//     return this.backend.put<any>(`${this.endpoint}/update/${id}`, customer);
//   }

//   // حذف مشتری (متصل به /api/v1/customers/remove/{id})
//   deleteCustomer(id: number): Observable<any> {
//     return this.backend.delete<any>(`${this.endpoint}/remove/${id}`);
//   }
// }
