import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PatientService } from 'src/app/services/patient.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { PatientCreationData } from 'src/app/models/patient.model';
import { Room } from 'src/app/models/room.model';
import { FilterSelection, PatientFilterItem, RoomFilterItem } from 'src/app/models/calendar-filter.model';

@Component({
  selector: 'app-therapist-calendar-filter-menu',
  templateUrl: './therapist-calendar-filter-menu.component.html',
  styleUrls: ['./therapist-calendar-filter-menu.component.css']
})
export class TherapistCalendarFilterMenuComponent implements OnInit, OnDestroy {
  @Input() therapistId?: number;
  @Output() filterChanged = new EventEmitter<FilterSelection>();

  // רשימות הפריטים
  patients: PatientFilterItem[] = [];
  rooms: RoomFilterItem[] = [];

  // מצב פתיחה/סגירה של כל קטגוריה
  isPatientsExpanded: boolean = false;
  isRoomsExpanded: boolean = false;

  // טעינה
  isLoadingPatients: boolean = false;
  isLoadingRooms: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private patientService: PatientService,
    private roomsService: RoomsService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * טעינת המידע: מטופלים וחדרים
   */
  private loadData(): void {
    this.loadPatients();
    this.loadRooms();
  }

  /**
   * טעינת רשימת המטופלים של המטפל
   */
  private loadPatients(): void {
    if (!this.therapistId) {
      console.warn('No therapistId provided to filter menu');
      return;
    }

    this.isLoadingPatients = true;
    this.patientService.getPatientsByTherapist(this.therapistId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (patientsData: PatientCreationData[]) => {
          this.patients = patientsData
            .filter(pd => pd.patient && pd.patient.patient_id)
            .map(pd => ({
              patient_id: pd.patient.patient_id!,
              displayName: `${pd.person.first_name || ''} ${pd.person.last_name || ''}`.trim(),
              isSelected: true // בברירת מחדל הכל מסומן
            }));
          this.isLoadingPatients = false;
          this.emitFilterChange();
        },
        error: (error) => {
          console.error('Error loading patients for filter:', error);
          this.isLoadingPatients = false;
        }
      });
  }

  /**
   * טעינת רשימת החדרים
   */
  private loadRooms(): void {
    this.isLoadingRooms = true;
    this.roomsService.getRooms()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rooms: Room[]) => {
          this.rooms = rooms.map(room => ({
            room_id: room.room_id,
            room_name: room.room_name,
            isSelected: true // בברירת מחדל הכל מסומן
          }));
          this.isLoadingRooms = false;
          this.emitFilterChange();
        },
        error: (error) => {
          console.error('Error loading rooms for filter:', error);
          this.isLoadingRooms = false;
        }
      });
  }

  /**
   * החלפת מצב פתיחה/סגירה של קטגוריית המטופלים
   */
  togglePatientsExpanded(): void {
    this.isPatientsExpanded = !this.isPatientsExpanded;
  }

  /**
   * החלפת מצב פתיחה/סגירה של קטגוריית החדרים
   */
  toggleRoomsExpanded(): void {
    this.isRoomsExpanded = !this.isRoomsExpanded;
  }

  /**
   * שינוי בחירה של מטופל בודד
   */
  onPatientSelectionChange(patientId: number, isChecked: boolean): void {
    const patient = this.patients.find(p => p.patient_id === patientId);
    if (patient) {
      patient.isSelected = isChecked;
      this.emitFilterChange();
    }
  }

  /**
   * שינוי בחירה של חדר בודד
   */
  onRoomSelectionChange(roomId: number, isChecked: boolean): void {
    const room = this.rooms.find(r => r.room_id === roomId);
    if (room) {
      room.isSelected = isChecked;
      this.emitFilterChange();
    }
  }

  /**
   * בחירה/ביטול בחירה של כל המטופלים
   */
  toggleAllPatients(isChecked: boolean): void {
    this.patients.forEach(patient => patient.isSelected = isChecked);
    this.emitFilterChange();
  }

  /**
   * בחירה/ביטול בחירה של כל החדרים
   */
  toggleAllRooms(isChecked: boolean): void {
    this.rooms.forEach(room => room.isSelected = isChecked);
    this.emitFilterChange();
  }

  /**
   * שליחת אירוע שינוי סינון להורה
   */
  private emitFilterChange(): void {
    const selectedPatientIds = this.patients
      .filter(p => p.isSelected)
      .map(p => p.patient_id);

    const selectedRoomIds = this.rooms
      .filter(r => r.isSelected)
      .map(r => r.room_id);

    // האם הכל מסומן?
    const allPatientsSelected = this.patients.length > 0 && 
      this.patients.every(p => p.isSelected);
    const allRoomsSelected = this.rooms.length > 0 && 
      this.rooms.every(r => r.isSelected);

    const filterSelection: FilterSelection = {
      selectedPatientIds,
      selectedRoomIds,
      showAll: allPatientsSelected && allRoomsSelected
    };

    this.filterChanged.emit(filterSelection);
  }

  /**
   * האם כל המטופלים מסומנים?
   */
  get areAllPatientsSelected(): boolean {
    return this.patients.length > 0 && this.patients.every(p => p.isSelected);
  }

  /**
   * האם כל החדרים מסומנים?
   */
  get areAllRoomsSelected(): boolean {
    return this.rooms.length > 0 && this.rooms.every(r => r.isSelected);
  }

  /**
   * האם יש מטופלים שנבחרו חלקית?
   */
  get isSomePatientsSelected(): boolean {
    const selectedCount = this.patients.filter(p => p.isSelected).length;
    return selectedCount > 0 && selectedCount < this.patients.length;
  }

  /**
   * האם יש חדרים שנבחרו חלקית?
   */
  get isSomeRoomsSelected(): boolean {
    const selectedCount = this.rooms.filter(r => r.isSelected).length;
    return selectedCount > 0 && selectedCount < this.rooms.length;
  }

  /**
   * מספר המטופלים הנבחרים
   */
  get selectedPatientsCount(): number {
    return this.patients.filter(p => p.isSelected).length;
  }

  /**
   * מספר החדרים הנבחרים
   */
  get selectedRoomsCount(): number {
    return this.rooms.filter(r => r.isSelected).length;
  }
}
