export interface Application {
  position: string;
  department: string;
  id: number;
  job_advertisement: number;
  job_title: string;
  job_department: string;
  job_type: string;
  job_location: string;
  applicant_name: string;
  email: string;
  phone: string;
  cover_letter: string;
  experience: string;
  skills: string[];
  status: "pending" | "reviewed" | "interviewed" | "hired" | "rejected";
  status_display: string;
  applied_date: string;
  resume_url: string | null;
  notes: string;
}
