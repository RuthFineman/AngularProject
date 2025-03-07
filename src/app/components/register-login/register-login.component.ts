import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-register-login',
  imports: [ReactiveFormsModule],
  templateUrl: './register-login.component.html',
  styleUrl: './register-login.component.css'
})
export class RegisterLoginComponent implements OnInit {
  registerForm!: FormGroup;
  loginForm!: FormGroup;
  NotConnected: boolean = true;
  userName: string | null = null; 

  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  onRegister() {
    this.http.post<{ userId: string, token: string }>('http://localhost:3000/api/auth/register', this.registerForm.value)
      .subscribe(response => {
        console.log('User registered:', response);
        sessionStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        this.userName = this.registerForm.value.name;
        this.NotConnected = false;
      }, console.error);
  }
  onLogin() { 
    this.http.post('http://localhost:3000/api/auth/login', this.loginForm.value)
      .subscribe({
        next: (response: any) => {
          console.log('User logged in:', response);
          sessionStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          this.userName = response.name;
          this.NotConnected = false;
        },
        error: (error) => {
          console.error('Login failed:', error);
          if (error.status === 401) {
            alert('הכניסה נכשלה. בדוק את המייל או הסיסמה');
          } else {
            alert('הכניסה נכשלה. בדוק את המייל או הסיסמה');
          }
        }
      });
  }
  
  logout() {
    if(this.NotConnected)
    {
      alert('שגיאה: משתמש לא מחובר')
    }
    this.NotConnected = true;
    this.userName = null; 
    sessionStorage.clear();
    this.router.navigate(['/register-login']);
  }
}
