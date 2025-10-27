import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TherapistData } from 'src/app/models/therapist.model';
import { UserData } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { AddTherapistDialogComponent } from '../add-therapist-dialog/add-therapist-dialog.component';

@Component({
  selector: 'app-therapist-list',
  templateUrl: './therapist-list.component.html',
  styleUrls: ['./therapist-list.component.css']
})
export class TherapistListComponent implements OnInit, OnDestroy {
  therapists: TherapistData[] = [];
  selectedTherapistId: number | null = null;
  secretaryId: number = 1; // שנה לפי המזכיר המחובר
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadTherapists();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTherapists() {
    this.isLoading = true;
    this.userService.getAllTherapists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (therapists) => {
          this.therapists = therapists;
          this.isLoading = false;
          console.log('Therapists loaded:', this.therapists);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error loading therapists:', error);
          // אפשר להוסיף הודעת שגיאה למשתמש
        }
      });
  }

  viewTherapistDetails(therapist: TherapistData) {
    const therapist_id = therapist.therapist_id;
    if (therapist_id) {
      this.selectedTherapistId = therapist_id;
      console.log('Selected therapist:', therapist);
      // כאן אפשר לפתוח דיאלוג של פרטי מטפל או לנווט לעמוד אחר
    }
  }

  openAddTherapistDialog(): void {
    const dialogRef = this.dialog.open(AddTherapistDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: false,
      direction: 'rtl',
      panelClass: 'therapist-dialog'
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          // המשתמש לחץ על "שמירה" - שומר את הנתונים
          this.onTherapistSave(result);
        }
        // אם result הוא null/undefined - המשתמש לחץ על "ביטול"
      });
  }

  onTherapistSave(event: { userData: UserData, therapistData: TherapistData }) {
    alert('userData: ' + JSON.stringify(event.userData) + '\ntherapistData: ' + JSON.stringify(event.therapistData));
    this.isLoading = true;
    this.userService.createTherapist(event.userData, event.therapistData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('מטפל חדש נוסף:', res);
          this.refreshTherapistsList();
          this.isLoading = false;
          alert('המטפל נוסף בהצלחה!');
        },
        error: (err) => {
          console.error('שגיאה ביצירת מטפל:', err);
          this.isLoading = false;
          alert('שגיאה בהוספת מטפל. אנא נסה שוב.');
        }
      });
  }

  refreshTherapistsList(): void {
    this.loadTherapists();
  }

  openSearchDialog(): void {
    const searchTerm = prompt('הכנס שם לחיפוש:');
    if (searchTerm && searchTerm.trim()) {
      this.isLoading = true;
      this.userService.searchTherapists(searchTerm.trim())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (results) => {
            console.log('תוצאות חיפוש:', results);
            if (results.length > 0) {
              this.therapists = results;
            } else {
              alert('לא נמצאו תוצאות');
            }
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error searching therapists:', error);
            this.isLoading = false;
            alert('שגיאה בחיפוש. אנא נסה שוב.');
          }
        });
    }
  }
}