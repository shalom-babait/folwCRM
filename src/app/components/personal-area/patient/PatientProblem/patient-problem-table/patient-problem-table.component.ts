import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PatientProblem } from 'src/app/models/patient-problems';
import { AddPatientProblemComponent } from '../add-patient-problem/add-patient-problem.component';
import { AddPatientProblemRatingComponent } from '../add-patient-problem-rating/add-patient-problem-rating.component';
import { PatientProblemsService } from 'src/app/services/patient-problems.service';
import { PatientProblemRatingListComponent } from '../patient-problem-rating-list/patient-problem-rating-list.component';

// Consolidated imports

@Component({
  selector: 'app-patient-problem-table',
  templateUrl: './patient-problem-table.component.html',
  styleUrls: ['./patient-problem-table.component.css',
    '../../../../../styles/shared-table.css'
  ]
})
export class PatientProblemTableComponent implements OnInit {
  @Input() patientId!: number;
  searchTerm: string = '';
  problems: (PatientProblem & { last_score?: number })[] = [];

  showRatings(problem: PatientProblem): void {
    if (!problem.patient_problem_id) return;
    console.log('מזהה בעיה שנשלח לדיאלוג:', problem.patient_problem_id);
    this.dialog.open(PatientProblemRatingListComponent, {
      width: '700px',
      data: { patientProblemId: problem.patient_problem_id }
    });
  }

  constructor(private dialog: MatDialog, private patientProblemsService: PatientProblemsService) {}

  ngOnInit(): void {
    if (this.patientId) {
      this.loadProblems();
    }
  }

  ngOnChanges(): void {
    if (this.patientId) {
      this.loadProblems();
    }
  }

  loadProblems(): void {
    this.patientProblemsService.getProblemsByPatientId(this.patientId).subscribe({
      next: (problems) => {
        this.problems = problems;
      },
      error: (err) => {
        // handle error, e.g., show message
        console.error('שגיאה בטעינת בעיות:', err);
      }
    });
  }

  get filteredProblems(): PatientProblem[] {
    if (!this.searchTerm.trim()) return this.problems;
    return this.problems.filter(p => p.title.includes(this.searchTerm));
  }

  openCreateProblemDialog(): void {
    this.dialog.open(AddPatientProblemComponent, {
      width: '400px',
      data: { patientId: this.patientId }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.loadProblems();
      }
    });
  }

  editProblem(problem: PatientProblem): void {
    // כאן תפתח דיאלוג עריכה
    alert('עריכת בעיה: ' + problem.title);
  }

  addProblemRating(problem: PatientProblem): void {
    if (!problem.patient_problem_id) return;
    this.dialog.open(AddPatientProblemRatingComponent, {
      width: '400px',
      data: {
        patient_problem_id: problem.patient_problem_id,
        last_score: (problem as any).last_score || null
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        // כאן אפשר לעדכן את הדירוגים של הבעיה (דמו)
        // לדוג' להציג הודעה או לעדכן תצוגה
      }
    });
  }

  deleteProblem(id: number): void {
    this.problems = this.problems.filter(p => p.patient_problem_id !== id);
  }
}
