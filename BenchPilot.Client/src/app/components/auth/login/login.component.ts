import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/app/dashboard']);
      return;
    }

    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      
      const loginData = {
        email: this.loginForm.value.email.toLowerCase().trim(),
        password: this.loginForm.value.password,
        rememberMe: this.loginForm.value.rememberMe
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            // Store auth data
            this.authService.setAuthData(response.token!, response.user!);
            
            // Show success message
            this.snackBar.open(`Welcome back, ${response.user!.fullName}!`, 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            
            // Redirect to dashboard
            this.router.navigate(['/app/dashboard']);
          } else {
            this.showErrors(response.errors);
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Login error:', error);
          
          if (error.error && error.error.errors) {
            this.showErrors(error.error.errors);
          } else if (error.error && error.error.message) {
            this.snackBar.open(error.error.message, 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          } else {
            this.snackBar.open('An error occurred during login. Please try again.', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private showErrors(errors: string[]): void {
    const errorMessage = errors.join('. ');
    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      email: 'Email',
      password: 'Password'
    };
    
    return displayNames[fieldName] || fieldName;
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }

  forgotPassword(): void {
    // TODO: Implement forgot password functionality
    this.snackBar.open('Forgot password functionality coming soon!', 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}