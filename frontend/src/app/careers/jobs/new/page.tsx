import { Metadata } from "next";
import AddJobForm from "../../components/AddJobForm";

export const metadata: Metadata = {
  title: "Post a New Job | SBC Careers",
  description: "Create a new job posting for SBC Careers",
};

export default function NewJobPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AddJobForm />
      </div>
    </main>
  );
}
