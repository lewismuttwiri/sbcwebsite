// frontend/src/types/job.ts
export interface JobPosting {
  id?: number;
  title: string;
  location: string;
  type: string;
  department: string;
  posted: string;
  description: string;
  requirements: string[];
  responsibilities: string;
}
