import { Component } from '@angular/core';
import { GroupsService } from 'src/app/services/groups.service';
import { Appointment } from 'src/app/models/appointment.model';

@Component({
  selector: 'app-departments-groups-view',
  templateUrl: './departments-groups-view.component.html',
  styleUrls: ['./departments-groups-view.component.css','../../../../../styles/views.css']
})
export class DepartmentsGroupViewComponent {
  selectedGroup: any = null;
  activeTab: string = 'patients';
  searchTerm: string = '';
  loading: boolean = false;

  groupAppointments: any[] = [];

  constructor(private groupsService: GroupsService) {}

  /** כאשר נבחרה קבוצה */
  onGroupSelected(group: any): void {
    this.selectedGroup = group;
    this.activeTab = 'patients';
    this.groupAppointments = [];
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'calendar' && this.selectedGroup) {
      this.loadGroupAppointments(this.selectedGroup.group_id);
    }
  }

  isActiveTab(tab: string): boolean {
    return this.activeTab === tab;
  }

  /** סגירת הסרגל */
  onCloseDetails(): void {
    this.selectedGroup = null;
    this.activeTab = 'patients';
    this.groupAppointments = [];
  }

  loadGroupAppointments(groupId: number): void {
    this.loading = true;
    this.groupsService.getAppointmentsByGroup(groupId).subscribe(res => {
      console.log('קיבלתי פגישות מהשרת:', res);
      const appointments = res.data || [];
      this.groupAppointments = appointments.map((a: any) => {
        // המרה לתאריך מקומי כדי למנוע תזוזה של יום
        let dateObj = a.appointment_date ? new Date(a.appointment_date) : null;
        let yyyy = dateObj ? dateObj.getFullYear() : '';
        let mm = dateObj ? String(dateObj.getMonth() + 1).padStart(2, '0') : '';
        let dd = dateObj ? String(dateObj.getDate()).padStart(2, '0') : '';
        let dateOnly = yyyy && mm && dd ? `${yyyy}-${mm}-${dd}` : '';
        const start = dateOnly + 'T' + (a.start_time || '00:00:00');
        const end = dateOnly + 'T' + (a.end_time || '00:00:00');
        const event = {
          id: a.appointment_id,
          title: a.therapist_name || a.therapist_id,
          start,
          end,
          ...a
        };
        console.log('אירוע ליומן:', event);
        return event;
      });
      this.loading = false;
      console.log('groupAppointments ליומן:', this.groupAppointments);
    }, err => {
      this.loading = false;
      console.error('שגיאה בטעינת פגישות:', err);
    });
  }
}
