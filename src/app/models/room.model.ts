export interface RoomAvailability {
  availability_id?: number;
  company_id: number;
  room_id: number;
  day_of_week: number; // 0=ראשון, 1=שני, ... 6=שבת
  start_time: string; // 'HH:mm:ss'
  end_time: string;   // 'HH:mm:ss'
}
export interface Room {
  room_id: number;
  room_name: string;
  color?: string;
  description?: string;
}
