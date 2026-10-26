import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Customer } from '../../../../../+shared/models/customer.model';
import { BackendService } from '../../../../../+shared/services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandResultDto } from '../../../../../+shared/models/command-result.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer',
  imports: [FormsModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent implements OnInit {
  private readonly backend = inject(BackendService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // شیء مشتری برای نگهداری اطلاعات
  customer: Customer = {
    id: 0,
    fullName: '',
    email: '',
    phone: '',
    company: '',
    status: 1,
    createdAt: new Date().toISOString(),
    userId: 0
  };

  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  // ngOnInit(): void {
  //   // خواندن پارامتر id از مسیر URL (مثلاً /customers/:id)
  //   const idParam = this.route.snapshot.paramMap.get('id');
  //   if (idParam) {
  //     const customerId = Number(idParam);
  //     this.loadCustomer(customerId);
  //   }
  // }
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    // فقط در صورتی که id وجود داشت و مقدار آن "new" نبود و عدد معتبر بود لود شود
    if (idParam && idParam !== 'new' && !isNaN(Number(idParam))) {
      const customerId = Number(idParam);
      this.loadCustomer(customerId);
    } else {
      // حالت ایجاد مشتری جدید: فرم خالی می‌ماند و هیچ درخواستی به سرور ارسال نمی‌شود
      this.isLoading = false;
    }
  }


  loadCustomer(id: number): void {
    this.isLoading = true;
    this.backend.get<Customer>(`/customers/${id}`).subscribe({
      next: (data) => {
        this.customer = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'خطا در بارگذاری اطلاعات مشتری';
        this.isLoading = false;
      }
    });
  }

  onSave(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    // ارسال به اندپوینت PUT بک‌اند
    this.backend.put<CommandResultDto>(`/customers/${this.customer.id}`, this.customer).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.successful) {
          this.successMessage = res.message || 'اطلاعات با موفقیت ذخیره شد.';
        } else {
          this.errorMessage = res.message || 'عملیات با خطا مواجه شد.';
        }
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'خطای سرور در ثبت تغییرات.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }
}
