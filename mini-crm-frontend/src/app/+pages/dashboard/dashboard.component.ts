import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../+shared/services/dashboard.service';
import { DashboardSummary, CustomerStatus } from '../../+shared/models/dashboard.model';
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);
  readonly CustomerStatus = CustomerStatus;

  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly summary = signal<DashboardSummary | null>(null);

  constructor() {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching dashboard summary:', err);
        this.error.set('خطا در دریافت اطلاعات داشبورد از سرور.');
        this.loading.set(false);
      }
    });
  }

  // تعریف کارت‌ها بر اساس وضعیت‌های واقعی پایگاه داده
  readonly statCards = computed(() => {
    const s = this.summary();
    if (!s) return [];

    return [
      {
        title: 'کل مشتریان',
        value: s.totalCustomers,
        hint: `+${s.newCustomersLast7Days} نفر در ۷ روز گذشته`,
        bgIcon: 'bg-indigo-50 text-indigo-600',
        badge: 'مجموع'
      },
      {
        title: 'سرنخ‌های جدید (Lead)',
        value: s.leadsCount,
        hint: 'مشتریان بالقوه نیازمند پیگیری',
        bgIcon: 'bg-amber-50 text-amber-600',
        badge: 'پیگیری'
      },
      {
        title: 'مشتریان فعال (Active)',
        value: s.activeCount,
        hint: 'دارای تعامل یا خرید',
        bgIcon: 'bg-emerald-50 text-emerald-600',
        badge: 'فعال'
      },
      {
        title: 'راکد / غیرفعال (Inactive)',
        value: s.inactiveCount,
        hint: 'نیازمند بازاریابی مجدد',
        bgIcon: 'bg-rose-50 text-rose-600',
        badge: 'غیرفعال'
      }
    ];
  });
}
