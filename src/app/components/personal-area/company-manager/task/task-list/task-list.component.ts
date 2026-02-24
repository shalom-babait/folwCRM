import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Task } from 'src/app/models/task.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { Router } from '@angular/router';
import { PatientStateService } from 'src/app/services/state/patient-state.service';
import { PatientData } from 'src/app/models/patient.model';
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  @Input() patientId: number | null = null;
  @Input() userId: number | null = null;
  @Input() filterFn?: (task: Task) => boolean;
  @Input() isHomePage: boolean = false;
  patients: PatientData[] = [];
  tasks: Task[] = [];
  addMode = false;
  addTaskForm: FormGroup;
  // משתנים אלו לא נדרשים כמשתנים גלובליים
  editTaskId: number | null = null;
  editTaskForm: FormGroup | null = null;

constructor(
  private fb: FormBuilder,
  private dialog: MatDialog,
  private taskService: TaskService,
  private patientState: PatientStateService, // ← במקום PatientService
  private router: Router
) {
  this.addTaskForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    patient_id: [null],
    created_by_user_id: [this.getCurrentUserId()],
    status: ['open', Validators.required],
    priority: ['medium'],
    due_date: [null],
    completed_at: [null],
    color: ['#FFD54F'],
    created_at: [this.getTodayDate()],
    updated_at: [null],
    assignmentTherapist: [true],
    assignmentPatient: [false]
  });
}
  private getTodayDate(): string {
    // Returns YYYY-MM-DD format
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // פונקציות שינוי צבע לא בשימוש בתבנית

getAssignmentLabel(task: Task): string {
  const hasTherapist = task.assignments?.some(a => a.entity_type === 'therapist') || false;
  const hasPatient = task.assignments?.some(a => a.entity_type === 'patient') || task.assignmentPatient || false;

  // הצגת שם המטופל מהסטייט בדף הבית (ללא מפה)
  let patientName = '';
  if (this.isHomePage && task.patient_id && this.patients.length > 0) {
    const found = this.patients.find(p => p.patient_id === task.patient_id);
    if (found && found.person) {
      const first = found.person.first_name || '';
      const last = found.person.last_name || '';
      patientName = (first + (last ? ' ' + last : '')).trim();
    }
  }
  if (hasTherapist && hasPatient) {
    return patientName
      ? `משויך למטפל ולמטופל (${patientName})`
      : 'משויך למטפל ולמטופל';
  }
  if (hasTherapist) return 'משויך למטפל';
  if (hasPatient) {
    return patientName
      ? `משויך למטופל (${patientName})`
      : 'משויך למטופל';
  }
  return '';
}

 ngOnInit(): void {
  // טוען מטופלים ומשימות רק כאשר isHomePage=true (כלומר, רק באזור האישי של מטפל)
  if (this.isHomePage) {
    // בדוק אם יש מתודה loadPatients ב-PatientStateService
    if (typeof (this.patientState as any).loadPatients === 'function') {
      (this.patientState as any).loadPatients();
    }
    this.patientState.patients$.subscribe((patients: PatientData[]) => {
  // ...existing code...
      this.patients = patients;
      // לאחר שהמטופלים נטענו, נטען את המשימות
      if (this.userId) {
        this.taskService.getTasksByUserId(this.userId).subscribe({
          next: (tasks: Task[]) => {
            this.tasks = this.filterFn ? tasks.filter(this.filterFn) : tasks;
          },
          error: (err: any) => console.error('שגיאה בקבלת משימות למשתמש', err)
        });
      } else if (this.patientId) {
        this.taskService.getTasksByPatientId(this.patientId).subscribe({
          next: (tasks) => {
            this.tasks = this.filterFn ? tasks.filter(this.filterFn) : tasks;
          },
          error: (err) => console.error('שגיאה בקבלת משימות', err)
        });
      }
    });
  } else if (this.userId) {
    this.taskService.getTasksByUserId(this.userId).subscribe({
      next: (tasks: Task[]) => {
        this.tasks = this.filterFn ? tasks.filter(this.filterFn) : tasks;
      },
      error: (err: any) => console.error('שגיאה בקבלת משימות למשתמש', err)
    });
  } else if (this.patientId) {
    this.taskService.getTasksByPatientId(this.patientId).subscribe({
      next: (tasks) => {
        this.tasks = this.filterFn ? tasks.filter(this.filterFn) : tasks;
      },
      error: (err) => console.error('שגיאה בקבלת משימות', err)
    });
  }
}
  showAddTaskCard(): void {
    this.addMode = true;
  // משתנים אלו הוסרו
    this.addTaskForm.reset({
      status: 'open',
      priority: 'medium',
      color: '#FFD54F',
      created_by_user_id: this.getCurrentUserId(),
      created_at: this.getTodayDate(),
      assignmentTherapist: true,
      assignmentPatient: false
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
      created_at: this.getTodayDate(),
      assignmentTherapist: true,
      assignmentPatient: false,
      therapistId: null,
      patientAssignmentId: null
    });
  }

  saveNewTask(): void {
    if (this.addTaskForm.invalid) return;
    // שיוך משימה: יצירת assignments לפי הצ'קבוקסים והמבנה של הטבלה
    const assignments = [];
    // נניח שיש לך דרך לקבל את מזהה המטפל (למשל מהמשתמש המחובר)
    const therapistId = this.getCurrentTherapistId();
    if (this.addTaskForm.value.assignmentTherapist && therapistId) {
      assignments.push({ entity_id: therapistId, entity_type: 'therapist' });
    }
    if (this.addTaskForm.value.assignmentPatient && this.patientId) {
      assignments.push({ entity_id: this.patientId, entity_type: 'patient' });
    }
    // אפשר לשמור משימה גם ללא שיוך כלל
    const newTask: Task = {
      ...this.addTaskForm.value,
      patient_id: this.patientId || null,
      created_by_user_id: this.getCurrentUserId(),
      status: this.addTaskForm.value.status,
      color: this.addTaskForm.value.color || '#FFD54F',
      assignments: assignments.map(a => ({ entity_id: a.entity_id, entity_type: a.entity_type }))
    };
  // ...existing code...
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
  const userObj = JSON.parse(localStorage.getItem('user') || '{}');
  return userObj.user?.user_id || 1;
  }


  // פונקציה זו לא בשימוש

  editTask(task: Task): void {
    this.editTaskId = task.task_id || null;
    // קביעת צ'קבוקסים ושדות ברירת מחדל
    let assignmentTherapist = false;
    let assignmentPatient = false;
    if (task.assignments) {
      assignmentTherapist = task.assignments.some(a => a.entity_type === 'therapist');
      assignmentPatient = task.assignments.some(a => a.entity_type === 'patient');
    }
  // משתנים אלו הוסרו
    this.editTaskForm = this.fb.group({
      title: [task.title, Validators.required],
      description: [task.description],
      status: [task.status, Validators.required],
      priority: [task.priority],
      due_date: [task.due_date],
      color: [task.color],
      created_at: [{ value: task.created_at, disabled: true }],
      assignmentTherapist: [assignmentTherapist],
      assignmentPatient: [assignmentPatient]
    });
  }

  cancelEditTask(): void {
    this.editTaskId = null;
    this.editTaskForm = null;
  }

  saveEditTask(task: Task): void {
    if (!this.editTaskForm || this.editTaskForm.invalid || !task.task_id) return;
    // נבנה assignments תמיד לפי בחירה נוכחית בטופס
    const assignments = [];
    const therapistId = this.getCurrentTherapistId();
    const assignmentTherapist = this.editTaskForm.get('assignmentTherapist')?.value;
    const assignmentPatient = this.editTaskForm.get('assignmentPatient')?.value;
    if (assignmentTherapist && therapistId) {
      assignments.push({ entity_id: therapistId, entity_type: 'therapist', task_id: task.task_id });
    }
    if (assignmentPatient && this.patientId) {
      assignments.push({ entity_id: this.patientId, entity_type: 'patient', task_id: task.task_id });
    }
    const updatedTask: Task = {
      ...task,
      ...this.editTaskForm.value,
      assignments
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

  // דוגמה לפונקציה שמחזירה מזהה מטפל (לשימוש אמיתי יש להחליף בלוגיקה שלך)
  private getCurrentTherapistId(): number | null {
    // נשלוף תמיד therapist_id מה-localStorage['therapist_id'] כמספר
    const therapistIdStr = localStorage.getItem('therapist_id');
    return therapistIdStr ? Number(therapistIdStr) : null;
  }

  private refreshTasks(): void {
    if (this.patientId) {
      this.taskService.getTasksByPatientId(this.patientId).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
        },
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
