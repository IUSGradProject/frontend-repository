import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { finalize } from 'rxjs';

let totalRequests = 0;

export const appInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  totalRequests++;
  loadingService.setLoading(true);
  return next(req).pipe(
    finalize(async () => {
      totalRequests--;
      if (totalRequests == 0) {
        loadingService.setLoading(false);
      }
    })
  );
};