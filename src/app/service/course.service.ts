import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private handleError(error: any): Observable<never> {
    console.error("Error in HTTP request:", error);
    return throwError(() => new Error(error.message || "Something went wrong"));
  }
  private getAuthHeaders(token: any): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  enrollStudent(courseId: string, token: string, userId: string): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.post(`${this.apiUrl}/${courseId}/enroll`, { userId }, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  unenrollFromCourse(courseId: string) {
    const userId = this.authService.getUserId();
    console.log('User ID:', userId);
    const yourToken = this.authService.getToken();
    const headers = this.getAuthHeaders(yourToken);
    return this.http.delete(`${this.apiUrl}/${courseId}/unenroll`, { headers, body: { userId } })
      .subscribe(response => {
        console.log('Student unenrolled from course successfully', response);
      }, error => {
        console.error('Error unenrolling student from course', error);
      });
  }
  getEnrolledCourses(token: string, userId: string): Observable<any> {
    if (!userId) {
      console.error("User ID is missing!");
      return throwError(() => new Error("User ID is missing"));
    }
    const url = `http://localhost:3000/api/courses/student/${userId}`;

    const headers = this.getAuthHeaders(token);
    return this.http.get(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  getCourses(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl, { headers });
  }
  getCourseById(courseId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/${courseId}`, { headers });
  }
  addCourse(title: string, description: string, teacherId: number, token: string): Observable<any> {
    if (!token) {
      return throwError(() => new Error("No token provided"));
    }
    const headers = this.getAuthHeaders(token);
    return this.http.post<any>(this.apiUrl, { title, description, teacherId }, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  updateCourse(id: string, updates: any, token: string): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.put<any>(`${this.apiUrl}/${id}`, updates, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  deleteCourse(courseId: string, token: string): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.delete<void>(`${this.apiUrl}/${courseId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  getAllLesson(courseId: string, token: string) {
    return this.http.get<any[]>(`${this.apiUrl}/${courseId}/lessons`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  getLesson(courseId: string, lessonId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/${courseId}/lessons/${lessonId}`, { headers });
  }
  AddLesson(token: string, title: string, content: string, courseId: string) {
    const headers = this.getAuthHeaders(token)
    const body = { title, content };
    return this.http.post(`${this.apiUrl}/${courseId}/lessons`, body, { headers });
  }
  updateLesson(courseId: string, lessonId: string, updates: any, token: string): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.put<any>(`${this.apiUrl}/${courseId}/lessons/${lessonId}`, updates, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  deleteLesson(courseId: string, lessonId: string, token: string): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.delete<any>(`${this.apiUrl}/${courseId}/lessons/${lessonId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
}
