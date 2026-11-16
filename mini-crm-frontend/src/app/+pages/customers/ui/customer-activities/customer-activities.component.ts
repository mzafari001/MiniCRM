import { Component, effect, inject, input, signal } from '@angular/core';
import { ActivityService } from '../../../../+shared/services/activity.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Activity, ActivityType, ActivityTypeLabels } from '../../../../+shared/models/activity.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-activities',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-activities.component.html',
  styleUrl: './customer-activities.component.scss'
})
export class CustomerActivitiesComponent {

  private readonly activityService = inject(ActivityService);
  private readonly fb = inject(FormBuilder);

  customerId = input.required<number>();

  activities = signal<Activity[]>([]);
  isLoading = signal(false);

  typeLabels = ActivityTypeLabels;

  activityTypes = [
    { value: ActivityType.Call, label: 'تماس تلفنی' },
    { value: ActivityType.Meeting, label: 'جلسه' },
    { value: ActivityType.Email, label: 'ایمیل' },
    { value: ActivityType.Note, label: 'یادداشت' }
  ];

  activityForm = this.fb.group({
    type: [
      ActivityType.Note,
      [Validators.required]
    ],
    note: [
      '',
      [Validators.required, Validators.minLength(3)]
    ],
    dueDate: [
      new Date().toISOString().substring(0, 16),
      [Validators.required]
    ],
    isCompleted: [true]
  });

  // جایگزین constructor
  private readonly customerIdEffect = effect(() => {
    const customerId = this.customerId();

    this.loadActivities(customerId);
  });

  private loadActivities(customerId: number): void {
    this.isLoading.set(true);

    this.activityService
      .getActivitiesByCustomer(customerId)
      .subscribe({
        next: (data) => {
          this.activities.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }

  onSubmit(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    const formValue = this.activityForm.getRawValue();

    const newActivity = {
      type: formValue.type!,
      note: formValue.note!,
      dueDate: formValue.dueDate!,
      isCompleted: formValue.isCompleted ?? false,
      customerId: this.customerId()
    };

    this.activityService.createActivity(newActivity).subscribe({
      next: () => {
        this.activityForm.patchValue({
          note: '',
          type: ActivityType.Note,
          isCompleted: true
        });

        this.loadActivities(this.customerId());
      }
    });
  }
}
