import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const _router = inject(Router);

  if(localStorage.getItem('user'))
    return true;
  else{
    _router.navigate(['/home']);
    return false;
  }
};
