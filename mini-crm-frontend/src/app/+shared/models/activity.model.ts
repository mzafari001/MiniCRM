export enum ActivityType {
  Call = 1,       // تماس تلفنی
  Meeting = 2,    // جلسه حضوری یا آنلاین
  Email = 3,      // ارسال ایمیل
  Note = 4        // یادداشت درون‌سازمانی
}

// برای نمایش متن فارسی انواع فعالیت در UI
export const ActivityTypeLabels: Record<ActivityType, string> = {
  [ActivityType.Call]: 'تماس تلفنی',
  [ActivityType.Meeting]: 'جلسه حضوری یا آنلاین',
  [ActivityType.Email]: 'ارسال ایمیل',
  [ActivityType.Note]: 'یادداشت درون‌سازمانی'
};

export interface Activity {
  id: number;
  type: ActivityType;
  note: string;
  dueDate: string;
  isCompleted: boolean;
  createdAt: string;
  customerId: number;
  userId: number;
}

export interface CreateActivity {
  type: ActivityType;
  note: string;
  dueDate: string;
  isCompleted: boolean;
  customerId: number;
}
