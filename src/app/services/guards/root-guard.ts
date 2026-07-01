import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from "../token-service";

export const rootGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isLoggedIn()) {
    router.navigate(['/home']);
    return false;
  }
  return true;
};
