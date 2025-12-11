import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TherapistCreationData, TherapistData } from 'src/app/models/therapist.model';
import { UserData } from 'src/app/models/user.model';
import { TherapistService } from 'src/app/services/therapist.service';
import { AddTherapistDialogComponent } from '../../therapist/add-therapist-dialog/add-therapist-dialog.component';

@Component({
  selector: 'app-therapist-list',
  templateUrl: './therapist-list.component.html',
  styleUrls: ['./therapist-list.component.css'
    , '../../../../styles/list-cards.css'
  ]
})
export class TherapistListComponent implements OnInit, OnDestroy {
  @Output() therapistSelected = new EventEmitter<TherapistCreationData>();
  // להצגה: מערך מטפלים קיימים
  therapists: TherapistCreationData[] = [];
  selectedTherapistId: number | null = null;
  secretaryId: number = 1; // שנה לפי המזכיר המחובר
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
  private therapistService: TherapistService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadTherapists();
  }

  ngOnDestroy() {
    // ניקוי כל ה-subscriptions כדי למנוע טעינה חוזרת וזליגת זיכרון
    this.destroy$.next();
    this.destroy$.complete();
    this.therapists = [];
    this.selectedTherapistId = null;
    this.isLoading = false;
  }

  loadTherapists() {
    this.isLoading = true;
  this.therapistService.getAllTherapists()
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

  openTherapistCalendar(therapist: TherapistData) {
    const therapist_id = therapist.therapist_id;
    if (therapist_id) {
      console.log('Opening calendar for therapist:', therapist);
      // כאן תוסיף את הלוגיקה לפתיחת היומן
      // לדוגמה: לנווט לעמוד יומן או לפתוח דיאלוג של יומן
      // this.router.navigate(['/calendar', therapist_id]);
      // או
      // this.dialog.open(TherapistCalendarDialogComponent, { data: { therapist } });
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
      .subscribe((result: TherapistCreationData | null) => {
        if (result) {
          // המשתמש לחץ על "שמירה" - שומר את הנתונים
          this.onTherapistSave(result);
        }
        // אם result הוא null/undefined - המשתמש לחץ על "ביטול"
      });
  }

  onTherapistSave(data: TherapistCreationData) {
    this.isLoading = true;
  // this.therapistService.createTherapist(data.user, data.therapist, data.selectedDepartments).subscribe({
  //       next: (res) => {
  //         console.log('מטפל חדש נוסף:', res);
  //         this.refreshTherapistsList();
  //         this.isLoading = false;
  //         alert('המטפל נוסף בהצלחה!');
  //       },
  //       error: (err) => {
  //         console.error('שגיאה ביצירת מטפל:', err);
  //         this.isLoading = false;
  //         alert('שגיאה בהוספת מטפל. אנא נסה שוב.');
  //       }
  //     });
  }

  refreshTherapistsList(): void {
    this.loadTherapists();
  }

  openSearchDialog(): void {
    const searchTerm = prompt('הכנס שם לחיפוש:');
    if (searchTerm && searchTerm.trim()) {
      this.isLoading = true;
  this.therapistService.searchTherapists(searchTerm.trim())
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
  viewTherapistDetails(therapist: TherapistCreationData) {
    const therapist_id = therapist.therapist.therapist_id;
    if (therapist_id) {
      this.selectedTherapistId = therapist_id;
      console.log('Selected therapist:', therapist);
      // שלח את המטפל לקומפוננטת האב
      this.therapistSelected.emit(therapist);
    }
  }
}