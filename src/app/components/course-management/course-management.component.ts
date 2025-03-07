import { Component, Input, OnInit } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-course-management',
  imports: [FormsModule],
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.css'
})
export class CourseManagementComponent implements OnInit {

  courses: any[] = [];
  selectedCourseId: string | null = null;
  title: string = '';
  description: string = '';
  newTitle: string = '';  
  newDescription: string = '';
  course: any;
  teacherId: any = '';

  constructor(private courseService: CourseService) { }
  userToken: string = sessionStorage.getItem('token') || '';
  selectedTeacherId: string | null = null;

  ngOnInit(): void {
    this.loadCourses();
    this.teacherId = sessionStorage.getItem('teacherId');
    console.log('teacherId from sessionStorage:', this.teacherId); 
  }

  private loadCourses(): void {
    if (!this.userToken) {
      console.error("No token found!");
      return;
    }
    this.courseService.getCourses(this.userToken).subscribe({
      next: (courses) => this.courses = courses,
      error: (error: HttpErrorResponse) => console.error("Error fetching courses:", error)
    });
  }

  selectCourseToUpdate(courseId: string): void {
    this.selectedCourseId = courseId;
    this.course = this.courses.find(c => c.id === courseId);
    if (this.course) {
      this.title = this.course.title;
      this.description = this.course.description;
      this.selectedTeacherId = this.course.teacherId; 
    }
  }
  updateCourse(id: string): void {
   
    if (!this.selectedCourseId || !this.title.trim() || !this.description.trim() || !this.selectedTeacherId) {
      alert('נא למלא את כל השדות');
      return;
    }
    if (!this.userToken) {
      alert('שגיאה: אין טוקן!');
      return;
    }

    const updates = {
      title: this.title,
      description: this.description,
      teacherId: Number(this.selectedTeacherId) 
    };
    this.courseService.updateCourse(id, updates, this.userToken).subscribe(
      response => {
        alert('Course updated successfully')
        console.log('Course updated successfully:', response);
      },
      error => {
        alert('Error')
        const errorMessage = error.error?.message || 'Error updating course';
        console.error('Error updating course:', errorMessage);
      }
    );
  }
  
  addCourse(): void {
    if (!this.newTitle.trim() || !this.newDescription.trim()) {
      alert('נא למלא את כל השדות');
      return;
    }
    const teacherid = Number(this.selectedTeacherId);
    if (!this.userToken) {
      alert('שגיאה: אין טוקן!');
      return;
    }
    this.courseService.addCourse(this.newTitle, this.newDescription, teacherid, this.userToken).subscribe({
      next: (newCourse) => {
        this.courses.push(newCourse);
        alert('הקורס נוסף בהצלחה');
        this.newTitle = '';
        this.newDescription = '';
        this.loadCourses();
      },
      error: (error: HttpErrorResponse) => {
        console.error('שגיאה בהוספת הקורס:', error);
        alert('אירעה שגיאה בעת הוספת הקורס');
      }
    });
  }

  deleteCourse(courseId: string): void {
    if (!confirm('האם אתה בטוח שברצונך למחוק את הקורס?')) return;

    if (!this.userToken) {
      alert('שגיאה: אין טוקן!');
      return;
    }
    this.courseService.deleteCourse(courseId, this.userToken).subscribe({
      next: () => {
        this.courses = this.courses.filter(course => course.id !== courseId);
        alert('הקורס נמחק בהצלחה');
      },
      error: (error: HttpErrorResponse) => {
        console.error('שגיאה במחיקת הקורס:', error);
        alert('אירעה שגיאה בעת מחיקת הקורס');
      }
    });
  }
}
