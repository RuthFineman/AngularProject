import { Routes } from '@angular/router';
import { RegisterLoginComponent } from './components/register-login/register-login.component';
import { AComponent } from './components/home/a.component';
import { AllCoursesComponent } from './components/all-courses/all-courses.component';
import { CourseManagementComponent } from './components/course-management/course-management.component';
import { LessonsComponent } from './components/lessons/lessons.component';
import { teacherGuard } from './guard/teacher.guard';
import { authGuard } from './guard/auth.guard';


export const routes: Routes = [
  { path: '', component: AComponent },
  { path: 'register-login', component: RegisterLoginComponent  },
  { path: 'allCourses', component: AllCoursesComponent,canActivate:[authGuard] },
  { path: 'course-management', component: CourseManagementComponent,canActivate:[teacherGuard] },
  { path: 'lesson-of-course', component:LessonsComponent,canActivate:[authGuard]},
  
];
