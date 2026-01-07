import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'  ]
})
export class AddTaskComponent {
taskForm: FormGroup;
  isSubmitting = false;
  isTriedToSubmit = false;

  statusOptions = [
    { value: 'open', label: 'פתוחה' },
    { value: 'in_progress', label: 'בטיפול' },
    { value: 'completed', label: 'הושלמה' },
    { value: 'cancelled', label: 'בוטלה' }
  ];

  priorityOptions = [
    { value: 'low', label: 'נמוכה' },
    { value: 'medium', label: 'בינונית' },
    { value: 'high', label: 'גבוהה' }
  ];

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      patient_id: [null],
      assigned_to_user_id: [null, Validators.required],
      status: ['open', Validators.required],
      priority: [null],
      due_date: [null]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.taskForm.get(field);
    return !!(control && control.invalid && (control.touched || this.isTriedToSubmit));
  }

  onSubmit(): void {
    this.isTriedToSubmit = true;

    if (this.taskForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const payload = this.taskForm.value;
    console.log('TASK PAYLOAD', payload);

    // כאן תחברי ל־API
    // this.taskService.createTask(payload).subscribe(...)
  }

  onCancel(): void {
    this.taskForm.reset({
      status: 'open'
    });
  }
}
