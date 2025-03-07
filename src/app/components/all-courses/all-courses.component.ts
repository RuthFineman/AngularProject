import { Component } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-all-courses',
  imports: [FormsModule],
  templateUrl: './all-courses.component.html',
  styleUrl: './all-courses.component.css'
})
export class AllCoursesComponent {
  courses: any[] = [];
  userToken: string = sessionStorage.getItem('token') || '';
  userId: string = localStorage.getItem('userId') || '';
  b: boolean = false
  courseId: string = '';
  selectedCourse: any = null;
  enrolledCourses: string[] = [];

  constructor(private courseService: CourseService,private authService: AuthService) { }
  ngOnInit(): void {
    this.loadCourses();
    this.getEnrolledCourses();
  }
  getEnrolledCourses(): void {
    if (!this.userId) {
      console.error("User ID is missing!");
      return;
    }
    this.courseService.getEnrolledCourses(this.userToken, this.userId).subscribe(
      (data: any[]) => {
        this.enrolledCourses = data.map(course => course.id);
      },
      (error) => {
        console.error('Error loading enrolled courses:', error);
      }
    );
  }
  toggleCourseEnrollment(courseId: string): void {
    const userId = this.userId; 
    if (this.isEnrolled(courseId)) {
        alert('שגיאה: הנך מחובר כבר לקורס זה '); 
        console.log(`User is already enrolled in course: ${courseId}`);
        return;  
    }
    this.courseService.enrollStudent(courseId, this.userToken, userId).subscribe({
        next: () => {
            this.enrolledCourses.push(courseId); 
            console.log(`User successfully enrolled in course: ${courseId}`);
            alert('Successfully enrolled in course!');
        },
        error: (err) => {
            console.error('Error enrolling in course:', err);
            alert('Failed to enroll in course. Please try again later.');
        }
    });
}
   isEnrolled(courseId: string): boolean { 
    return this.enrolledCourses.includes(courseId);
  }

  
  onUnenroll(courseId: string) {
    if (!this.isEnrolled(courseId)) {
      alert('הנך לא רשום לקורס זה');
      console.log(`User is not enrolled in course: ${courseId}`);
      return; 
  }
    this.courseService.unenrollFromCourse(courseId);
  }
  loadCourses(): void {
    this.courseService.getCourses(this.userToken).subscribe(
      (data) => {
        this.courses = data;
      },
      (error) => {
        console.error('Error loading courses:', error);
      }
    );
  }
  viewCourse(courseId: string): void {
    this.b = true;
    //אולי השורה הזאת שגויה
    courseId = this.courseId;
    this.courseService.getCourseById(courseId, this.userToken).subscribe(
      (data) => {
        this.selectedCourse = data;
      },
      (error) => {
        console.error('Error fetching course details:', error);
        alert('שגיאה: קורס לא קיים במערכת')
      }
    );
  }
}
