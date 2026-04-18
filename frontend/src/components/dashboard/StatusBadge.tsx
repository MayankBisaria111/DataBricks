type StatusBadgeProps = {
  status: "On Time" | "Delayed" | "Critical";
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles =
    status === "On Time"
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : status === "Delayed"
        ? "border-amber-100 bg-amber-50 text-amber-700"
        : "border-rose-100 bg-rose-50 text-rose-700";

  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}>{status}</span>;
}
