import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPatientProblemRatingComponent } from '../add-patient-problem-rating/add-patient-problem-rating.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartType } from 'chart.js';
import { PatientProblemsService } from 'src/app/services/patient-problems.service';
import { PatientProblemRating } from 'src/app/models/patient-problems';

@Component({
  selector: 'app-patient-problem-rating-list',
  templateUrl: './patient-problem-rating-list.component.html',
  styleUrls: ['./patient-problem-rating-list.component.css'
    , '../../../../../styles/shared-table.css'
  ]
})
export class PatientProblemRatingListComponent implements OnInit {
  patientProblemId!: number;
  ratings: PatientProblemRating[] = [];
  sortedRatings: PatientProblemRating[] = [];
  loading = false;
  error: string | null = null;

  // Chart.js data
  public lineChartData: any[] = [];
  public lineChartLabels: string[] = [];
  public lineChartOptions = {
    responsive: true,
    scales: {
      y: { min: 1, max: 10, reverse: true, title: { display: true, text: 'דירוג' } },
      x: { title: { display: true, text: 'תאריך' } }
    }
  };
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  constructor(
    private patientProblemsService: PatientProblemsService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { patientProblemId: number }
  ) {
    this.patientProblemId = data.patientProblemId;
  }
  openAddRatingDialog(): void {
    const dialogRef = this.dialog.open(AddPatientProblemRatingComponent, {
      width: '400px',
      data: { patient_problem_id: this.patientProblemId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // רענון דירוגים לאחר הוספה
        this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {
    if (!this.patientProblemId) return;
    console.log('מזהה בעיה שהתקבל בקומפוננטה:', this.patientProblemId);
    this.loading = true;
    this.patientProblemsService.getProblemRatingsByProblemId(this.patientProblemId).subscribe({
      next: (ratings) => {
        this.ratings = ratings || [];
        this.prepareChartData();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'שגיאה בטעינת דירוגים';
        this.loading = false;
      }
    });
  }

  prepareChartData(): void {
    // Sort by date ascending
    this.sortedRatings = [...this.ratings].sort((a, b) => a.rating_date.localeCompare(b.rating_date));
    // Format dates as DD/MM/YYYY for X axis
    this.lineChartLabels = this.sortedRatings.map(r => {
      const d = new Date(r.rating_date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    });

    // פונקציה שמחזירה צבע בין ירוק לאדום לפי ערך (1=ירוק, 10=אדום)
    function getColor(score: number): string {
      // 1 -> green (#4CAF50), 10 -> red (#FF0000)
      // נבנה גרדיאנט RGB בין ירוק לאדום
      const percent = (score - 1) / 9;
      // ירוק: 76, 175, 80 | אדום: 255, 0, 0
      const r = Math.round(76 + (255 - 76) * percent);
      const g = Math.round(175 + (0 - 175) * percent);
      const b = Math.round(80 + (0 - 80) * percent);
      return `rgb(${r},${g},${b})`;
    }

    const dataArr = this.sortedRatings.map(r => r.score);
    const pointColors = dataArr.map(score => getColor(score));

    this.lineChartData = [
      {
        data: dataArr,
        label: 'דירוג',
        fill: false,
        borderColor: '#2A5448',
        backgroundColor: pointColors,
        pointBackgroundColor: pointColors,
        pointBorderColor: pointColors,
        tension: 0.2
      }
    ];
  }
}
