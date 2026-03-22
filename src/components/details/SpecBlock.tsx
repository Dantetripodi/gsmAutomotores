type SpecBlockProps = {
  title: string;
  rows: Record<string, string> | undefined;
};

export function SpecBlock({ title, rows }: SpecBlockProps) {
  if (!rows || Object.keys(rows).length === 0) return null;
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-neutral-900">{title}</h4>
      <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white divide-y divide-neutral-200">
        {Object.entries(rows).map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-3 text-sm"
          >
            <span className="text-neutral-600">{label}</span>
            <span className="font-medium text-neutral-900 text-right sm:text-left sm:max-w-[55%]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
