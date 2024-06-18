export function Frequency({ count, total }: { count: number; total: number }) {
  const full = (count / total) * 100;
  return (
    <span title={`${count} times out of ${total}`}>
      {full.toLocaleString(undefined, { maximumFractionDigits: 2 })}%
    </span>
  );
}
