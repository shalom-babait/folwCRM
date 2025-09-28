import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateTreatmentDialogComponent } from '../create-treatment-dialog/add-treatment-dialog.component';

@Component({
  selector: 'app-treatment-list',
  templateUrl: './treatment-list.component.html',
  styleUrls: ['./treatment-list.component.css']
})
export class TreatmentListComponent implements OnInit {
  treatments: any[] = [];
  searchTerm: string = '';

  constructor(
    private patientService: PatientService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.patientService.getTreatments().subscribe(data => {
      this.treatments = data;
    });
  }

  openCreateTreatmentDialog() {
    const dialogRef = this.dialog.open(CreateTreatmentDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // אם צריך, רענון רשימת טיפולים אחרי הוספה
        this.patientService.getTreatments().subscribe(data => {
          this.treatments = data;
        });
      }
    });
  }
}
