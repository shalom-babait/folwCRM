

import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Task } from 'src/app/models/task.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  @Input() patientId: number | null = null;
  tasks: Task[] = [];
  addMode = false;
  addTaskForm: FormGroup;
  editTaskId: number | null = null;
  editTaskForm: FormGroup | null = null;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private taskService: TaskService) {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      patient_id: [null],
      created_by_user_id: [this.getCurrentUserId()],
      assigned_to_user_id: [1],
      status: ['open', Validators.required],
      priority: ['medium'],
      due_date: [null],
      completed_at: [null],
      color: ['#FFD54F'],
  created_at: [this.getTodayDate()],
      updated_at: [null]
    });
  }

  private getTodayDate(): string {
    // Returns YYYY-MM-DD format
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onAddTaskColorChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.addTaskForm.get('color')?.setValue(value);
  }

  onEditTaskColorChange(event: Event): void {
    if (!this.editTaskForm) return;
    const value = (event.target as HTMLInputElement).value;
    this.editTaskForm.get('color')?.setValue(value);
  }

  ngOnInit(): void {
    if (this.patientId) {
      this.taskService.getTasksByPatientId(this.patientId).subscribe({
        next: (tasks) => this.tasks = tasks,
        error: (err) => console.error('שגיאה בקבלת משימות', err)
      });
    }
  }

  showAddTaskCard(): void {
    this.addMode = true;
    this.addTaskForm.reset({
      status: 'open',
      priority: 'medium',
      color: '#FFD54F',
      created_by_user_id: this.getCurrentUserId(),
      created_at: this.getTodayDate()
    });
  }

  formatDateDDMMYYYY(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    // Support both 'YYYY-MM-DD' and ISO string
    let dateObj: Date;
    if (dateStr.length > 10) {
      // ISO string
      dateObj = new Date(dateStr);
    } else {
      // YYYY-MM-DD
      dateObj = new Date(dateStr + 'T00:00:00');
    }
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }

  cancelAddTask(): void {
    this.addMode = false;
    this.addTaskForm.reset({
      status: 'open',
      priority: 'medium',
      color: '#FFD54F',
      created_by_user_id: this.getCurrentUserId(),
      created_at: this.getTodayDate()
    });
  }

  saveNewTask(): void {
    if (this.addTaskForm.invalid) return;
    const newTask: Task = {
      ...this.addTaskForm.value,
      patient_id: this.patientId || null,
      created_by_user_id: this.getCurrentUserId(),
      assigned_to_user_id: this.addTaskForm.value.assigned_to_user_id,
      status: this.addTaskForm.value.status,
      color: this.addTaskForm.value.color || '#FFD54F'
    };
    this.taskService.addTask(newTask).subscribe({
      next: (savedTask) => {
        this.tasks = [savedTask, ...this.tasks];
        this.cancelAddTask();
      },
      error: (err) => {
        // אפשר להוסיף הודעת שגיאה למשתמש
        console.error('שגיאה בשמירת משימה', err);
      }
    });
  }

  private getCurrentUserId(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.user_id || 1;
  }


  openAddTaskDialog(): void {
    // Removed dialog opening logic
  }

  editTask(task: Task): void {
    this.editTaskId = task.task_id || null;
    this.editTaskForm = this.fb.group({
      title: [task.title, Validators.required],
      description: [task.description],
      status: [task.status, Validators.required],
      priority: [task.priority],
      due_date: [task.due_date],
      color: [task.color],
      assigned_to_user_id: [task.assigned_to_user_id],
      created_at: [{ value: task.created_at, disabled: true }],
    });
  }

  cancelEditTask(): void {
    this.editTaskId = null;
    this.editTaskForm = null;
  }

  saveEditTask(task: Task): void {
    if (!this.editTaskForm || this.editTaskForm.invalid || !task.task_id) return;
    const updatedTask: Task = {
      ...task,
      ...this.editTaskForm.value
    };
    this.taskService.updateTask(task.task_id, updatedTask).subscribe({
      next: () => {
        this.refreshTasks();
        this.cancelEditTask();
      },
      error: (err) => {
        // אפשר להוסיף הודעת שגיאה למשתמש
        console.error('שגיאה בעדכון משימה', err);
      }
    });
  }

  private refreshTasks(): void {
    if (this.patientId) {
      this.taskService.getTasksByPatientId(this.patientId).subscribe({
        next: (tasks) => this.tasks = tasks,
        error: (err) => console.error('שגיאה ברענון משימות', err)
      });
    }
  }

  deleteTask(task: Task): void {
    if (!task.task_id) return;
    this.taskService.deleteTask(task.task_id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.task_id !== task.task_id);
      },
      error: (err) => {
        // אפשר להוסיף הודעת שגיאה למשתמש
        console.error('שגיאה במחיקת משימה', err);
      }
    });
  }

  getStatusLabel(status: Task['status']): string {
    switch (status) {
      case 'open': return 'פתוחה';
      case 'in_progress': return 'בטיפול';
      case 'completed': return 'הושלמה';
      case 'cancelled': return 'בוטלה';
      default: return '';
    }
  }
}
