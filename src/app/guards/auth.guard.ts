import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (!sessionStorage.getItem('adminToken')) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};