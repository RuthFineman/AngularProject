import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { CourseService } from '../../service/course.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lessons',
  imports: [FormsModule],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.css'
})
export class LessonsComponent {
  private apiUrl = 'http://localhost:3000/api/courses';
  courses: any[] = []
  title: string = ''
  content: string = ''
  userId: string = localStorage.getItem('userId') || '';
  constructor(private courseService: CourseService) { }
  userToken: string = sessionStorage.getItem('token') || '';
  courseId: string = '';
  isAddLessonOpen = false;
  selectedCourseId: string = '';
  selectedCourseLessons: any[] = [];
  selectedCourseIdForLessons: string | null = null;
  isUpdateLessonOpen = false;
  selectedLessonId: string = '';

  ngOnInit(): void {
    this.loadCourses();
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
  getAllLesson(courseId: string) {
    this.selectedCourseIdForLessons = courseId; 
    this.courseService.getAllLesson(courseId, this.userToken).subscribe(
      (lessons) => {
        this.selectedCourseLessons = lessons;
      },
      (error) => {
        console.error('Error fetching lessons:', error);
      }
    );
  }
  getLesson(courseId: string, lessonId: string) {
    this.courseService.getLesson(courseId, lessonId, this.userToken).subscribe(
      (lesson) => {
        console.log('Lesson details:', lesson);
      },
      (error) => {
        console.error('Error fetching lesson:', error);
      }
    );
  }
  addLesson() {
    if (!this.selectedCourseId) return;

    this.courseService.AddLesson(this.userToken, this.title, this.content, this.selectedCourseId)
      .subscribe(response => {
        console.log('Lesson created:', response);
        alert('השיעור נוסף בהצלחה');
        this.title = '';
        this.content = '';
        this.closeModal();
      }, error => {
        console.error('Error creating lesson:', error);
        alert('אין לך הרשאה להוסיף שיעור');
      });
  }
  openAddLessonModal(courseId: string) {
    this.selectedCourseId = courseId;
    this.isAddLessonOpen = true;
  }
  closeModal() {
    this.isAddLessonOpen = false;
  }
  trackByCourseId(index: number, course: any): number {
    return course.id;
  }
  updateLesson() {
    if (!this.selectedCourseId || !this.selectedLessonId || !this.userToken) {
      alert('חסרים נתונים לעדכון השיעור');
      return;
    }
    const updates = {
      title: this.title,
      content: this.content,
      courseId: this.selectedCourseId
    };
    console.log('Updating lesson with data:', updates); 
    this.courseService.updateLesson(this.selectedCourseId, this.selectedLessonId, updates, this.userToken).subscribe(
      response => {
        console.log('Lesson updated:', response);
        alert('השיעור עודכן בהצלחה');
        this.closeModal2();
        this.getAllLesson(this.selectedCourseId );
      },
      error => {
        console.error('Error updating lesson:', error);
        alert('חסרה לך הרשאה לביצוע במשימה');
      }
    );
  }
  openUpdateLessonModal(lessonId: string,courseId:string) {
    this.selectedLessonId = lessonId;
    this.isUpdateLessonOpen = true;
    this.selectedCourseId=courseId;
  }
  closeModal2() {
    this.isUpdateLessonOpen = false;
  }
  deleteLesson(courseId: string, lessonId: string) {
    if (!this.userToken) {
      alert('חסרה הרשאת משתמש');
      return;
    }
    this.courseService.deleteLesson(courseId, lessonId, this.userToken).subscribe(
      response => {
        console.log('Lesson deleted:', response);
        alert('השיעור נמחק בהצלחה');
        this.getAllLesson(courseId); 
      },
      error => {
        console.error('Error deleting lesson:', error);
        alert('חסרה לך הרשאה לביצוע המשימה');
      }
    );
  }
  
}
