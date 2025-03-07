import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
export const teacherGuard: CanActivateFn = (route, state) => {
  const isLogin = sessionStorage.getItem('token');
  const router = inject(Router);
  const service = inject(AuthService);
  const status = service.getRoleByToken()
  if (status === 'teacher') {
    return true;
  }
  else{
    alert('אין לך הרשאה לביצוע המשימה')
     return false;
  }
 
};
