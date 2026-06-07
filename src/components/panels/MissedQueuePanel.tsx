import { useClinicStore } from '../../store/useClinicStore';
import { UserX, Clock, AlertTriangle, RotateCcw, CheckCircle } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

export function MissedQueuePanel() {
  const { missedRecords, returnMissedPatient } = useClinicStore();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <UserX className="w-5 h-5 text-red-600" />
          过号管理
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {missedRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <CheckCircle className="w-12 h-12 mb-2 opacity-50 text-green-400" />
            <span>暂无过号记录</span>
          </div>
        ) : (
          missedRecords.map((record) => (
            <div
              key={record.id}
              className={`p-3 rounded-lg border transition-colors ${
                record.hasReturned
                  ? 'border-gray-200 bg-gray-50 opacity-75'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{record.patientName}</span>
                    <span className="text-xs text-gray-500">{record.patientNumber}</span>
                    {record.hasReturned ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        已回归
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        待处理
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    科室：{record.departmentId}
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>过号时间：{formatTime(record.missedTime)}</span>
                </div>
              </div>

              <div className="mt-2">
                <div className="text-xs text-gray-600">
                  <span className="text-gray-400">过号原因：</span>
                  {record.reason}
                </div>
                {record.hasReturned && record.returnedTime && (
                  <div className="text-xs text-green-600 mt-1">
                    回归时间：{formatTime(record.returnedTime)}
                  </div>
                )}
              </div>

              {!record.hasReturned && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => returnMissedPatient(record.id)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    回归队列
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
