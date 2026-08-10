import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

export const adminGuard: CanActivateFn = (_route, _state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && (auth.userRole() === 'Admin' || auth.userRole() === 'SuperAdmin')) {
    return true;
  }

  router.navigate(['/auth/admin-login']);
  return false;
};
