import { useClinicStore } from '../../store/useClinicStore';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import {
  X,
  User,
  Clock,
  FileText,
  MapPin,
  AlertCircle,
  History,
} from 'lucide-react';
import {
  formatTime,
  formatWaitTime,
  getElapsedMinutes,
} from '../../utils/formatters';

export function PatientDetailSidebar() {
  const { selectedPatient, setSelectedPatient, departments } = useClinicStore();

  if (!selectedPatient) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col items-center justify-center text-gray-400">
        <User className="w-16 h-16 mb-3 opacity-30" />
        <p className="text-sm">点击患者卡片查看详情</p>
      </div>
    );
  }

  const department = departments.find((d) => d.id === selectedPatient.departmentId);
  const elapsedMinutes = getElapsedMinutes(selectedPatient.checkInTime);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">患者详情</h3>
        <button
          onClick={() => setSelectedPatient(null)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">{selectedPatient.name}</span>
                <PriorityBadge priority={selectedPatient.priority} />
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {selectedPatient.gender === 'male' ? '男' : '女'} · {selectedPatient.age} 岁
              </div>
              <div className="text-sm text-gray-500 mt-0.5">
                挂号编号：{selectedPatient.patientNumber}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <StatusBadge status={selectedPatient.status} />
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              就诊信息
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">就诊科室</span>
                <span className="text-gray-900 font-medium">{department?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">主治医生</span>
                <span className="text-gray-900">{department?.doctorName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">诊室</span>
                <span className="text-gray-900">{department?.roomNumber || '-'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              候诊时间
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">签到时间</span>
                <span className="text-gray-900">{formatTime(selectedPatient.checkInTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">已等待</span>
                <span className="text-gray-900">{elapsedMinutes} 分钟</span>
              </div>
              {selectedPatient.status === 'waiting' && (
                <div className="flex justify-between">
                  <span className="text-gray-500">预计还需</span>
                  <span className="text-blue-600 font-medium">
                    {formatWaitTime(selectedPatient.estimatedWaitTime)}
                  </span>
                </div>
              )}
              {selectedPatient.calledTime && (
                <div className="flex justify-between">
                  <span className="text-gray-500">叫号时间</span>
                  <span className="text-gray-900">{formatTime(selectedPatient.calledTime)}</span>
                </div>
              )}
            </div>
          </div>

          {selectedPatient.examType && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                检查信息
              </h4>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">检查项目</span>
                  <span className="text-gray-900">{selectedPatient.examType}</span>
                </div>
                {selectedPatient.examRoom && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">检查室</span>
                    <span className="text-gray-900">{selectedPatient.examRoom}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedPatient.missedCount > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <History className="w-4 h-4" />
                过号记录
              </h4>
              <div className="bg-red-50 rounded-lg p-3 space-y-2 text-sm border border-red-100">
                <div className="flex justify-between">
                  <span className="text-red-600">过号次数</span>
                  <span className="text-red-700 font-medium">{selectedPatient.missedCount} 次</span>
                </div>
                {selectedPatient.missedReason && (
                  <div className="flex justify-between">
                    <span className="text-red-500">过号原因</span>
                    <span className="text-red-700">{selectedPatient.missedReason}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedPatient.notes && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                备注信息
              </h4>
              <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800 border border-amber-100">
                {selectedPatient.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
