import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity, CreateActivity } from '../models/activity.model';
import { CommandResultDto } from '../models/command-result.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private http = inject(HttpClient);
  // آدرس پایه‌ی API شما (مشابه بقیه سرویس‌ها)
  private apiUrl = 'https://localhost:xxxx/api/activities'; // یا آدرس بیس پروژه شما

  // گرفتن لیست وقایع یک مشتری خاص
  getActivitiesByCustomer(customerId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  // ثبت واقعه‌ی جدید
  createActivity(activity: CreateActivity): Observable<CommandResultDto> {
    return this.http.post<CommandResultDto>(this.apiUrl, activity);
  }
}
