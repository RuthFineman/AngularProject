import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JwtPayload, jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
  
export class AuthService {
  private apiUrl = 'http://localhost:3000'; 
  constructor(private http: HttpClient) { }
  getToken(): string | null {
    return sessionStorage.getItem('token'); 
  }
  register(name: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password, role });
  }
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
         if (res && res.teacherId) {
          sessionStorage.setItem('teacherId', res.teacherId.toString());
         }
      })
    );
  }
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decodedToken: JwtPayload & { userId?: string } = jwtDecode(token);
      return decodedToken.userId || null;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
  getRoleByToken(): string {
    const token = sessionStorage.getItem('token');
    if (!token) return ''
    try {
      const decodedToken: any = jwtDecode(token)
      return decodedToken.role
    }
    catch (error) {
      console.error('שגיאה בפענוח ה-Token:', error)
      return ''
    }
  }
}
