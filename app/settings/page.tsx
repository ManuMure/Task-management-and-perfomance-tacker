import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import SessionCard from "@/components/SessionCard";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-[#EEF2FA]">
      <Sidebar />
      <main className="flex-1 px-10 pb-10">
        <TopBar title="Settings" />
        <div className="flex max-w-3xl flex-col gap-6">
          
          <SessionCard />
        </div>
      </main>
    </div>
  );
}