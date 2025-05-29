export interface Application {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  position: string;
  resumeUrl: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'hired' | 'rejected';
  appliedDate: string;
  skills: string[];
  experience: string;
  notes?: string;
}
