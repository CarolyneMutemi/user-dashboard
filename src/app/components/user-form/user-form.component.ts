import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() userData: any = null;
  @Input() mode: 'add' | 'edit' = 'add';
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  userForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && this.userData) {
      this.userForm.patchValue(this.userData, { emitEvent: false });
    }
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      website: [''],
      address: this.fb.group({
        street: ['', [Validators.required]],
        suite: [''],
        city: ['', [Validators.required]],
        zipcode: ['', [Validators.required]],
        geo: this.fb.group({
          lat: [''],
          lng: ['']
        })
      }),
      company: this.fb.group({
        name: ['', [Validators.required]],
        catchPhrase: [''],
        bs: ['']
      })
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    // Mark all fields as touched to trigger validation display
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
      
      // If it's a FormGroup, mark its controls as touched too
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedKey => {
          const nestedControl = control.get(nestedKey);
          nestedControl?.markAsTouched();
          
          // Handle nested geo group
          if (nestedControl instanceof FormGroup) {
            Object.keys(nestedControl.controls).forEach(deepKey => {
              nestedControl.get(deepKey)?.markAsTouched();
            });
          }
        });
      }
    });

    if (this.userForm.valid) {
      this.formSubmit.emit(this.userForm.value);
      this.submitted = false;
      this.userForm.reset();
    }
  }

  onCancel(): void {
    this.submitted = false;
    this.userForm.reset();
    this.formCancel.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched || this.submitted)) : false;
  }

  getFieldError(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control?.errors && (control.dirty || control.touched || this.submitted)) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Please enter a valid email';
      if (control.errors['minlength']) return 'Please enter a valid phone number';
    }
    return '';
  }
}