import { useClinicStore } from '../../store/useClinicStore';
import { Stethoscope, MapPin, Clock, CheckCircle, Circle, CircleDashed, Activity } from 'lucide-react';
import { formatTime, getExamStatusLabel, getExamStatusColor } from '../../utils/formatters';
import type { ExamItem } from '../../types';

const examSteps = [
  { key: 'scheduled', label: '待检查', Icon: Circle },
  { key: 'in-transit', label: '前往途中', Icon: CircleDashed },
  { key: 'in-progress', label: '检查中', Icon: Activity },
  { key: 'completed', label: '已完成', Icon: CheckCircle },
];

interface ExamStepIndicatorProps {
  status: ExamItem['status'];
}

function ExamStepIndicator({ status }: ExamStepIndicatorProps) {
  const currentIndex = examSteps.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center gap-1">
      {examSteps.map((step, index) => {
        const Icon = step.Icon;
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div key={step.key} className="flex items-center">
            <div
              className={`p-0.5 rounded-full transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-300'
              }`}
            >
              <Icon className={`w-3 h-3 ${isCurrent ? 'fill-blue-100' : ''}`} />
            </div>
            {index < examSteps.length - 1 && (
              <div
                className={`w-3 h-0.5 mx-0.5 transition-colors ${
                  index < currentIndex ? 'bg-blue-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ExamReminderPanel() {
  const { examItems, updateExamStatus } = useClinicStore();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-indigo-600" />
          检查提醒
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {examItems.map((exam) => (
          <div
            key={exam.id}
            className="p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-gray-900">{exam.patientName}</div>
                <div className="text-sm text-gray-600 mt-0.5">{exam.examType}</div>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getExamStatusColor(
                  exam.status
                )}`}
              >
                {getExamStatusLabel(exam.status)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{exam.examRoom}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>预约 {formatTime(exam.scheduledTime)}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <ExamStepIndicator status={exam.status} />
              {exam.status !== 'completed' && (
                <div className="flex gap-1">
                  {exam.status === 'scheduled' && (
                    <button
                      onClick={() => updateExamStatus(exam.id, 'in-transit')}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      出发
                    </button>
                  )}
                  {exam.status === 'in-transit' && (
                    <button
                      onClick={() => updateExamStatus(exam.id, 'in-progress')}
                      className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors"
                    >
                      开始检查
                    </button>
                  )}
                  {exam.status === 'in-progress' && (
                    <button
                      onClick={() => updateExamStatus(exam.id, 'completed')}
                      className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      完成
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-2 text-xs text-gray-400">预计时长 {exam.estimatedDuration} 分钟</div>
          </div>
        ))}
      </div>
    </div>
  );
}
