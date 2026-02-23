/**
 * מודל לסינון יומן מטפל
 */
export interface FilterSelection {
  selectedPatientIds: number[];
  selectedRoomIds: number[];
  showAll: boolean;
}

/**
 * פריט מטופל לסינון
 */
export interface PatientFilterItem {
  patient_id: number;
  displayName: string;
  isSelected: boolean;
}

/**
 * פריט חדר לסינון
 */
export interface RoomFilterItem {
  room_id: number;
  room_name: string;
  isSelected: boolean;
}
