import React from 'react';

interface DurationProps {
  value: number;
  max: number;
}

export default function Duration({ value, max }: DurationProps) {
  const percentage = (value / max) * 100;

  return (
    <div className="duration">
      <div>
        <div style={{ width: `${percentage.toFixed(2)}%` }}>
          <span>{`${percentage.toFixed(1)}%`}</span>
        </div>
      </div>
      <span>{value.toFixed(3)}s</span>
    </div>
  );
}
