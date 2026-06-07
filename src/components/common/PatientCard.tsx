import type { Patient } from '../../types';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { formatWaitTime, formatTime, getElapsedMinutes, formatExamReturnTime, isExamOverdue } from '../../utils/formatters';
import { Clock, User, MapPin, AlertTriangle } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  isSelected?: boolean;
  isAffected?: boolean;
  onClick?: () => void;
  queuePosition?: number;
}

export function PatientCard({
  patient,
  isSelected = false,
  isAffected = false,
  onClick,
  queuePosition,
}: PatientCardProps) {
  const elapsedMinutes = getElapsedMinutes(patient.checkInTime);

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
          : isAffected
          ? 'border-amber-300 bg-amber-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {queuePosition !== undefined && (
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
              {queuePosition + 1}
            </span>
          )}
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{patient.name}</span>
              <span className="text-xs text-gray-500">
                {patient.gender === 'male' ? '男' : '女'} {patient.age}岁
              </span>
            </div>
            <div className="text-xs text-gray-500">
              挂号编号：{patient.patientNumber}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <PriorityBadge priority={patient.priority} />
          <StatusBadge status={patient.status} />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>签到 {formatTime(patient.checkInTime)}</span>
          <span className="text-gray-300">|</span>
          <span>已等 {elapsedMinutes} 分钟</span>
        </div>
        {patient.status === 'waiting' && (
          <span className="text-blue-600 font-medium">
            预计还需 {formatWaitTime(patient.estimatedWaitTime)}
          </span>
        )}
      </div>

      {patient.notes && (
        <div className="mt-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
          备注：{patient.notes}
        </div>
      )}

      {patient.status === 'in-transit' && patient.examEstimatedReturnTime && (
        <div className={`mt-2 text-xs px-2 py-1.5 rounded border ${
          isExamOverdue(patient.examEstimatedReturnTime)
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-orange-50 border-orange-200 text-orange-700'
        }`}>
          <div className="flex items-center gap-1 mb-1">
            {isExamOverdue(patient.examEstimatedReturnTime) ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            <span className="font-medium">
              {isExamOverdue(patient.examEstimatedReturnTime) ? '已超时未返回' : '检查途中'}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {patient.examDepartureTime && (
              <span>离开：{formatTime(patient.examDepartureTime)}</span>
            )}
            <span>
              {formatExamReturnTime(patient.examEstimatedReturnTime)}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />
            <span>{patient.examDepartment || patient.examRoom || '检查科室'}</span>
          </div>
          {patient.examType && (
            <div className="mt-0.5">检查项目：{patient.examType}</div>
          )}
        </div>
      )}

      {patient.missedCount > 0 && (
        <div className="mt-1 text-xs text-red-600">
          过号 {patient.missedCount} 次 {patient.missedReason && `：${patient.missedReason}`}
        </div>
      )}
    </div>
  );
}
