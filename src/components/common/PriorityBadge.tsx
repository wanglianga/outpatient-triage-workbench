import type { Priority } from '../../types';
import { getPriorityLabel, getPriorityColor } from '../../utils/formatters';
import { User, Baby, AlertTriangle, Star } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
}

const iconMap: Record<Priority, React.ReactNode> = {
  normal: <User className="w-3 h-3 mr-1" />,
  elderly: <User className="w-3 h-3 mr-1" />,
  child: <Baby className="w-3 h-3 mr-1" />,
  emergency: <AlertTriangle className="w-3 h-3 mr-1" />,
  vip: <Star className="w-3 h-3 mr-1" />,
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(
        priority
      )}`}
    >
      {iconMap[priority]}
      {getPriorityLabel(priority)}
    </span>
  );
}
