import { useClinicStore } from '../../store/useClinicStore';
import { Stethoscope, MapPin, Clock, CheckCircle, Circle, CircleDashed, Activity, AlertTriangle, Phone } from 'lucide-react';
import { formatTime, getExamStatusLabel, getExamStatusColor, isExamOverdue, getElapsedMinutes } from '../../utils/formatters';
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
  const { examItems, updateExamStatus, inTransitPatients, markExamReturnReminded } = useClinicStore();

  const overduePatients = inTransitPatients.filter(
    (p) => p.examEstimatedReturnTime && isExamOverdue(p.examEstimatedReturnTime)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-indigo-600" />
          检查提醒
        </h3>
      </div>

      {overduePatients.length > 0 && (
        <div className="px-4 py-3 bg-red-50 border-b border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">超时未返回提醒 ({overduePatients.length})</span>
          </div>
          <div className="space-y-2">
            {overduePatients.map((patient) => {
              const overdueMinutes = patient.examEstimatedReturnTime
                ? getElapsedMinutes(patient.examEstimatedReturnTime)
                : 0;
              return (
                <div
                  key={patient.id}
                  className={`p-2 rounded-lg border text-xs ${
                    patient.examReturnReminded
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-red-100 border-red-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-gray-600">{patient.examType} · {patient.examDepartment || patient.examRoom}</div>
                      <div className="text-red-600 mt-0.5">
                        已超时 {overdueMinutes} 分钟
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {!patient.examReturnReminded && (
                        <button
                          onClick={() => markExamReturnReminded(patient.id)}
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          电话确认
                        </button>
                      )}
                      {patient.examReturnReminded && (
                        <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs rounded">
                          已提醒
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
