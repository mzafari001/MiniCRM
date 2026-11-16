import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendService } from '../../../+shared/services/backend.service';
import { CreateCustomer, Customer } from '../../../+shared/models/customer.model';
import { CommandResultDto } from '../../../+shared/models/command-result.model';
import { CustomerComponent } from './customer/ui/customer.component';

@Component({
  selector: 'app-customers',
  imports: [CustomerComponent, ReactiveFormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  private readonly backend = inject(BackendService);
  private readonly fb = inject(FormBuilder);
  viewMode = signal<'list' | 'detail'>('list');
  readonly customers = signal<Customer[]>([]);
  readonly selectedCustomer = signal<Customer | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly actionMessage = signal('');

  readonly showCreateForm = signal(false);
  readonly editingCustomer = signal<Customer | null>(null);
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

        // اگر کارت جزئیات باز است، اطلاعات تازهٔ همان مشتری را نمایش بده.
        // const selected = this.selectedCustomer();
        // if (selected) {
        //   this.selectedCustomer.set(
        //     data.find(customer => customer.id === selected.id) ?? null
        //   );
        // }
        const selected = this.selectedCustomer();
        if (selected) {
          const updatedCustomer =
            data.find(customer => customer.id === selected.id) ?? null;

          this.selectedCustomer.set(updatedCustomer);

          if (!updatedCustomer) {
            this.viewMode.set('list');
          }
        }

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
    this.viewMode.set('detail');
  }

  // closeDetails(): void {
  //   this.selectedCustomer.set(null);
  // }
  closeDetails(): void {
    this.viewMode.set('list');
    this.selectedCustomer.set(null);
  }
  onCreateCustomer(): void {
    if (this.isSaving()) return;

    this.editingCustomer.set(null);
    this.createForm.reset({
      fullName: '',
      phone: '',
      email: '',
      company: '',
      status: 1
    });
    this.createErrorMessage.set('');
    this.actionMessage.set('');
    this.showCreateForm.set(true);
  }

  onEdit(customer: Customer): void {
    if (this.isSaving()) return;

    this.editingCustomer.set(customer);
    this.createForm.reset({
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email ?? '',
      company: customer.company ?? '',
      status: Number(customer.status)
    });
    this.viewMode.set('list');
    this.createErrorMessage.set('');
    this.actionMessage.set('');
    this.showCreateForm.set(true);
  }

  cancelCreateCustomer(): void {
    if (this.isSaving()) return;

    this.showCreateForm.set(false);
    this.editingCustomer.set(null);
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

    if (this.createForm.invalid || this.isSaving()) return;

    const formValue = this.createForm.getRawValue();
    const editing = this.editingCustomer();

    if (!formValue.fullName.trim() || !formValue.phone.trim()) {
      this.createErrorMessage.set('نام و شماره تلفن مشتری الزامی است.');
      return;
    }

    const payload: CreateCustomer = {
      fullName: formValue.fullName.trim(),
      phone: formValue.phone.trim(),
      email: formValue.email.trim() || null,
      company: formValue.company.trim() || null,
      status: Number(formValue.status)
    };

    this.isSaving.set(true);
    this.createErrorMessage.set('');

    const request$ = editing
      ? this.backend.put<CommandResultDto>(
        `/api/v1/customers/update/${editing.id}`,
        {
          ...payload,
          // چون بک‌اند UserId را هم بازنویسی می‌کند، مقدار قبلی‌اش را حفظ کن.
          userId: editing.userId ?? null
        }
      )
      : this.backend.post<CommandResultDto>(
        '/api/v1/customers/create',
        payload
      );

    request$.subscribe({
      next: (result) => {
        this.isSaving.set(false);

        if (!result.successful) {
          this.createErrorMessage.set(
            result.message ||
            (editing ? 'ویرایش مشتری ناموفق بود.' : 'ثبت مشتری ناموفق بود.')
          );
          return;
        }

        // تا زمان دریافت لیست تازه، کارت جزئیات هم مقدار جدید را نشان بدهد.
        if (editing && this.selectedCustomer()?.id === editing.id) {
          this.selectedCustomer.set({
            ...this.selectedCustomer()!,
            ...payload
          });
        }

        this.cancelCreateCustomer();
        this.actionMessage.set(
          editing
            ? 'مشتری با موفقیت ویرایش شد.'
            : 'مشتری جدید با موفقیت ثبت شد.'
        );
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
            : editing
              ? 'ویرایش مشتری انجام نشد. دوباره تلاش کن.'
              : 'ثبت مشتری انجام نشد. اتصال به سرور را بررسی کن.'
        );
      }
    });
  }

  onDeleteCustomer(customer: Customer): void {
    const isConfirmed = confirm(
      `آیا از حذف مشتری «${customer.fullName}» اطمینان دارید؟`
    );
    if (!isConfirmed) return;

    this.backend
      .delete<CommandResultDto>(
        `/api/v1/customers/remove/${customer.id}`
      )
      .subscribe({
        next: (result) => {
          if (!result.successful) {
            alert(result.message || 'حذف مشتری ناموفق بود.');
            return;
          }

          if (this.selectedCustomer()?.id === customer.id) {
            this.selectedCustomer.set(null);
          }

          this.loadCustomers();
        },
        error: (err) => {
          console.error('خطا در حذف مشتری:', err);
          alert('خطایی در هنگام حذف مشتری رخ داد.');
        }
      });
  }
}
