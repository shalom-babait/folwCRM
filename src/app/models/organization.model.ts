import { ex } from "@fullcalendar/core/internal-common";
import { UserData } from "./user.model";
import { Person } from "./person.model";

export interface Organization {
  organization_id?: number;
  organization_name: string;
  owner_user_id: number;
  organization_type: 'company' | 'clinic' | 'personal';
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}
export interface OrganizationCreationData {
  organization: Organization;
  person:Person;
  user:UserData;
}