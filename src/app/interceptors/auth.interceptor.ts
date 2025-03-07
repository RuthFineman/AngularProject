import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {

  const token = sessionStorage.getItem('token');

  if (token && token.trim() !== '') {
    console.log(`🔐 Interceptor מוסיף טוקן: ${token}`);
    
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.warn('⚠️ אין טוקן זמין - הבקשה נשלחת ללא Authentication');
  }

  return next(req);
};


