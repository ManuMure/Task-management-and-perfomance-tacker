import { RegistrationStatus } from "@/types/registration";

const styles: Record<RegistrationStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Pending: "bg-blue-50 text-blue-700",
  Suspended: "bg-red-50 text-red-600",
};

export default function RegistrationStatusBadge({ status }: { status: RegistrationStatus }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}