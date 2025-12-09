import { HealthDashboard } from "../components/health/HealthDashboard";
import { GRPCTester } from "../components/grpc/GRPCTester";
import { DataExportButton } from "@/components/export/dataExportButton";
import { mockVocData } from "@/services/mock/mockVocExportData";

export default function Home() {
  const exportData = mockVocData;

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-slate-100 px-6 py-12 font-sans text-zinc-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <HealthDashboard />
        <DataExportButton data={exportData} />
        <GRPCTester />
      </div>
    </main>
  );
}
