import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private readonly http = inject(HttpClient);

  // متد عمومی GET با قابلیت تعیین تایپ خروجی <T>
  get<T>(api: string): Observable<T> {
    return this.http.get<T>(environment.server + api).pipe(
      delay(environment.fakedelay)
    );
  }

  // متد عمومی POST با قابلیت تعیین تایپ ورودی و خروجی
  post<T>(api: string, data: any): Observable<T> {
    return this.http.post<T>(environment.server + api, data).pipe(
      delay(environment.fakedelay)
    );
  }

  // متد عمومی PUT
  put<T>(api: string, data: any): Observable<T> {
    return this.http.put<T>(environment.server + api, data).pipe(
      delay(environment.fakedelay)
    );
  }

  // متد عمومی DELETE
  delete<T>(api: string): Observable<T> {
    return this.http.delete<T>(environment.server + api).pipe(
      delay(environment.fakedelay)
    );
  }
}
