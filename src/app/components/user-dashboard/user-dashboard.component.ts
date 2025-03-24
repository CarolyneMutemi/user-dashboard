import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  selectedUser: any = null;

  showAddUserForm: boolean = false;
  userForm!: FormGroup;

  showUserForm = false;
  formMode: 'add' | 'edit' = 'add';

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  addUser(): void {
    this.formMode = 'add';
    this.selectedUser = null;
    this.showUserForm = true;
  }

  editUser(user: any): void {
    this.formMode = 'edit';
    this.selectedUser = user;
    this.showUserForm = true;
  }

  closeUserForm(): void {
    this.showUserForm = false;
    this.selectedUser = null;
  }

  // Updated helper methods with proper configuration
  showSuccessMessage(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.horizontalPosition = 'right';  // 'start', 'center', 'end', 'left', 'right'
    config.verticalPosition = 'top';      // 'top', 'bottom'
    config.panelClass = ['success-snackbar'];
    
    this.snackBar.open(message, 'Close', config);
  }

  showErrorMessage(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    config.horizontalPosition = 'right';
    config.verticalPosition = 'top';
    config.panelClass = ['error-snackbar'];
    
    this.snackBar.open(message, 'Close', config);
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      website: [''],
      address: this.fb.group({
        street: ['', Validators.required],
        suite: [''],
        city: ['', Validators.required],
        zipcode: ['', Validators.required],
        geo: this.fb.group({
          lat: [''],
          lng: ['']
        })
      }),
      company: this.fb.group({
        name: ['', Validators.required],
        catchPhrase: [''],
        bs: ['']
      })
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
          this.filterUsers();
          this.showErrorMessage('User deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.showErrorMessage('Error deleting user!');
        }
      });
    }
  }

  viewDetails(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.selectedUser = user;
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      }
    });
  }

  closeModal(): void {
    this.selectedUser = null;
  }


  getGoogleMapsUrl(geo: { lat: string, lng: string }): string {
    return `https://www.google.com/maps?q=${geo.lat},${geo.lng}`;
  }

  // Helper method for nested form controls
  isFieldInvalid(path: string): boolean {
    const control = this.userForm.get(path);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  onUserFormSubmit(formData: any): void {
    if (this.formMode === 'add') {
      this.userService.addUser(formData).subscribe({
        next: (response) => {
          console.log('User added successfully:', response);
          this.loadUsers();
          this.closeUserForm();
          this.showSuccessMessage('User added successfully!');
        },
        error: (error) => {
          console.error('Error adding user:', error);
          this.showErrorMessage('Error adding user!');
        }
      });
    } else {
      this.userService.updateUser(this.selectedUser.id, formData).subscribe({
        next: (response) => {
          console.log('User updated successfully:', response);
          this.loadUsers();
          this.closeUserForm();
          this.showSuccessMessage('User updated successfully!');
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.showErrorMessage('Error updating user!');
        }
      });
    }
  }
}