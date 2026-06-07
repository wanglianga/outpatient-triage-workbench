import type { CongestionLevel } from '../../types';
import { getCongestionLabel, getCongestionColor } from '../../utils/formatters';

interface CongestionIndicatorProps {
  level: CongestionLevel;
  showLabel?: boolean;
}

export function CongestionIndicator({ level, showLabel = true }: CongestionIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => {
          const levels: CongestionLevel[] = ['low', 'medium', 'high', 'critical'];
          const currentLevelIndex = levels.indexOf(level);
          const isActive = i <= currentLevelIndex + 1;
          return (
            <div
              key={i}
              className={`w-1.5 h-4 rounded-sm transition-all duration-300 ${
                isActive ? getCongestionColor(level) : 'bg-gray-200'
              }`}
            />
          );
        })}
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700">{getCongestionLabel(level)}</span>
      )}
    </div>
  );
}
