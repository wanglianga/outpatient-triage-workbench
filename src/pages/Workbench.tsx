import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DepartmentStatusPanel } from '../components/panels/DepartmentStatusPanel';
import { CallingQueuePanel } from '../components/panels/CallingQueuePanel';
import { ExamReminderPanel } from '../components/panels/ExamReminderPanel';
import { MissedQueuePanel } from '../components/panels/MissedQueuePanel';
import { PatientDetailSidebar } from '../components/sidebar/PatientDetailSidebar';
import { useClinicStore } from '../store/useClinicStore';

export function Workbench() {
  const { selectedPatient } = useClinicStore();

  return (
    <DashboardLayout>
      <div className="h-full grid gap-4" style={{ gridTemplateColumns: selectedPatient ? '300px 1fr 1fr 320px' : '300px 1fr 1fr' }}>
        <div className="h-full overflow-hidden">
          <DepartmentStatusPanel />
        </div>

        <div className="h-full overflow-hidden">
          <CallingQueuePanel />
        </div>

        <div className="h-full grid grid-rows-2 gap-4 overflow-hidden">
          <div className="overflow-hidden">
            <ExamReminderPanel />
          </div>
          <div className="overflow-hidden">
            <MissedQueuePanel />
          </div>
        </div>

        {selectedPatient && (
          <div className="h-full overflow-hidden animate-fadeIn">
            <PatientDetailSidebar />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
