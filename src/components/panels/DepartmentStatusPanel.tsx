import { useClinicStore } from '../../store/useClinicStore';
import { CongestionIndicator } from '../common/CongestionIndicator';
import { Users, UserCheck, Clock, Armchair } from 'lucide-react';

export function DepartmentStatusPanel() {
  const { departments, selectedDepartmentId, setSelectedDepartment } = useClinicStore();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          诊区实时状态
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {departments.map((dept) => (
          <div
            key={dept.id}
            onClick={() =>
              setSelectedDepartment(selectedDepartmentId === dept.id ? null : dept.id)
            }
            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedDepartmentId === dept.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-gray-900">{dept.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {dept.doctorName} · {dept.roomNumber}
                </div>
              </div>
              <CongestionIndicator level={dept.congestionLevel} />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1 text-gray-600">
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>候诊 {dept.waitingCount} 人</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>平均 {dept.avgWaitTime}分</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Armchair className="w-3.5 h-3.5 text-green-500" />
                <span>
                  座位 {dept.seatUsed}/{dept.seatTotal}
                </span>
              </div>
            </div>

            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                style={{ width: `${(dept.seatUsed / dept.seatTotal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
