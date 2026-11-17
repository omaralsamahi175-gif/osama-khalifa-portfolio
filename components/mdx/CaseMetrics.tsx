export function CaseMetrics({ metrics }: { metrics: [string, string][] }) {
  return (
    <div className="osk-case-metrics">
      {metrics.map(([value, label]) => (
        <div key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}
