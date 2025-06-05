import { Metadata } from "next";
import TendersPage from "./TenderPage";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Tenders | SBC",
  description: "View and download current tenders from SBC",
};

export default function Page() {
  return (
    <Container>
      <div>
        <TendersPage />
      </div>
    </Container>
  );
}
