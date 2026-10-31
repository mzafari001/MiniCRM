import { Component, inject, OnInit, signal } from '@angular/core';
import { CustomerService } from '../../../+shared/services/customer.service';
import { CreateCustomer, Customer } from '../../../+shared/models/customer.model';
import { RouterLink } from '@angular/router';
import { BackendService } from '../../../+shared/services/backend.service';
import { CustomerComponent } from './customer/ui/customer.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommandResultDto } from '../../../+shared/models/command-result.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customers',
  imports: [CustomerComponent ,RouterLink,CustomerComponent, ReactiveFormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  private readonly backend = inject(BackendService);
  private readonly fb = inject(FormBuilder);

  readonly customers = signal<Customer[]>([]);
  readonly selectedCustomer = signal<Customer | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly actionMessage = signal('');

  readonly showCreateForm = signal(false);
  readonly isSaving = signal(false);
  readonly createErrorMessage = signal('');

  readonly createForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: ['', [Validators.email]],
    company: [''],
    status: [1, [Validators.required]]
  });

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.backend.get<Customer[]>('/api/v1/customers/list').subscribe({
      next: (data) => {
        this.customers.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('خطا در دریافت لیست:', err);
        this.errorMessage.set('دریافت اطلاعات مشتریان ناموفق بود.');
        this.isLoading.set(false);
      }
    });
  }

  selectCustomer(customer: Customer): void {
    this.selectedCustomer.set(customer);
    this.actionMessage.set('');
  }

  closeDetails(): void {
    this.selectedCustomer.set(null);
  }

  onEdit(customer: Customer): void {
    this.actionMessage.set(`دکمه ویرایش برای «${customer.fullName}» فشرده شد.`);
  }

  onDelete(customer: Customer): void {
    this.actionMessage.set(`دکمه حذف برای «${customer.fullName}» فشرده شد.`);
  }

  onCreateCustomer(): void {
    this.showCreateForm.set(true);
    this.createErrorMessage.set('');
    this.actionMessage.set('');
  }

  cancelCreateCustomer(): void {
    if (this.isSaving()) {
      return;
    }

    this.showCreateForm.set(false);
    this.createErrorMessage.set('');
    this.createForm.reset({
      fullName: '',
      phone: '',
      email: '',
      company: '',
      status: 1
    });
  }

  submitCreateCustomer(): void {
    this.createForm.markAllAsTouched();

    if (this.createForm.invalid || this.isSaving()) {
      return;
    }

    const formValue = this.createForm.getRawValue();

    const payload: CreateCustomer = {
      fullName: formValue.fullName.trim(),
      phone: formValue.phone.trim(),
      email: formValue.email.trim() || null,
      company: formValue.company.trim() || null,
      status: formValue.status
    };

    this.isSaving.set(true);
    this.createErrorMessage.set('');

    this.backend
      .post<CommandResultDto>('/api/v1/customers/create', payload)
      .subscribe({
        next: (result) => {
          this.isSaving.set(false);

          if (!result.successful) {
            this.createErrorMessage.set(
              result.message || 'ثبت مشتری ناموفق بود.'
            );
            return;
          }

          this.showCreateForm.set(false);
          this.createForm.reset({
            fullName: '',
            phone: '',
            email: '',
            company: '',
            status: 1
          });

          this.actionMessage.set(result.message || 'مشتری با موفقیت ثبت شد.');
          this.loadCustomers();
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);

          const apiMessage = (
            err.error as { message?: unknown } | null
          )?.message;

          this.createErrorMessage.set(
            typeof apiMessage === 'string'
              ? apiMessage
              : 'ثبت مشتری انجام نشد. اتصال به سرور را بررسی کن و دوباره تلاش کن.'
          );
        }
      });
  }
}
