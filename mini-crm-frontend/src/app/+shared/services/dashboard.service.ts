import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BackendService } from './backend.service';
import { DashboardSummary } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly backend = inject(BackendService);

  getSummary(): Observable<DashboardSummary> {
    return this.backend.get<DashboardSummary>(
      '/api/v1/dashboard/summary'
    );
  }
}
