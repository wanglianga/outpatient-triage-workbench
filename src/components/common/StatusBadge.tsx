import type { PatientStatus } from '../../types';
import { getStatusLabel, getStatusColor } from '../../utils/formatters';

interface StatusBadgeProps {
  status: PatientStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
