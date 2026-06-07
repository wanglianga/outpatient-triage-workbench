import { create } from 'zustand';
import type {
  Department,
  Patient,
  ExamItem,
  MissedRecord,
  CallRecord,
} from '../types';
import {
  mockDepartments,
  mockPatients,
  mockExamItems,
  mockMissedRecords,
  mockCurrentCall,
} from '../data/mockData';

interface ClinicState {
  departments: Department[];
  waitingQueue: Patient[];
  currentCall: CallRecord | null;
  examItems: ExamItem[];
  missedRecords: MissedRecord[];
  selectedPatient: Patient | null;
  selectedDepartmentId: string | null;
  dragOverIndex: number | null;

  setSelectedDepartment: (id: string | null) => void;
  setSelectedPatient: (patient: Patient | null) => void;
  setDragOverIndex: (index: number | null) => void;
  callNextPatient: () => void;
  recallPatient: (patientId: string) => void;
  movePatientInQueue: (fromIndex: number, toIndex: number) => void;
  markPatientMissed: (patientId: string, reason: string) => void;
  returnMissedPatient: (recordId: string) => void;
  updateExamStatus: (examId: string, status: ExamItem['status']) => void;
  getAffectedPatients: (fromIndex: number, toIndex: number) => Patient[];
}

export const useClinicStore = create<ClinicState>((set, get) => ({
  departments: mockDepartments,
  waitingQueue: mockPatients.filter((p) => p.status === 'waiting'),
  currentCall: mockCurrentCall,
  examItems: mockExamItems,
  missedRecords: mockMissedRecords,
  selectedPatient: null,
  selectedDepartmentId: null,
  dragOverIndex: null,

  setSelectedDepartment: (id) => set({ selectedDepartmentId: id }),

  setSelectedPatient: (patient) => set({ selectedPatient: patient }),

  setDragOverIndex: (index) => set({ dragOverIndex: index }),

  callNextPatient: () => {
    const { waitingQueue } = get();
    if (waitingQueue.length === 0) return;

    const [nextPatient, ...restQueue] = waitingQueue;
    const now = new Date();

    const newCall: CallRecord = {
      id: `call-${Date.now()}`,
      patientId: nextPatient.id,
      patientName: nextPatient.name,
      patientNumber: nextPatient.patientNumber,
      departmentId: nextPatient.departmentId,
      roomNumber: get().departments.find((d) => d.id === nextPatient.departmentId)?.roomNumber || '',
      callTime: now,
      callCount: 1,
      status: 'calling',
    };

    const updatedPatient = { ...nextPatient, status: 'called' as const, calledTime: now };

    set({
      waitingQueue: restQueue.map((p) => ({
        ...p,
        estimatedWaitTime: Math.max(0, p.estimatedWaitTime - 5),
      })),
      currentCall: newCall,
    });

    if (get().selectedPatient?.id === nextPatient.id) {
      set({ selectedPatient: updatedPatient });
    }
  },

  recallPatient: (patientId) => {
    const { waitingQueue, currentCall } = get();
    const patientIndex = waitingQueue.findIndex((p) => p.id === patientId);
    if (patientIndex <= 0) return;

    const patient = waitingQueue[patientIndex];
    const newQueue = [...waitingQueue];
    newQueue.splice(patientIndex, 1);
    newQueue.unshift(patient);

    set({ waitingQueue: newQueue });
  },

  movePatientInQueue: (fromIndex, toIndex) => {
    const { waitingQueue } = get();
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || fromIndex >= waitingQueue.length) return;
    if (toIndex < 0 || toIndex >= waitingQueue.length) return;

    const newQueue = [...waitingQueue];
    const [moved] = newQueue.splice(fromIndex, 1);
    newQueue.splice(toIndex, 0, moved);

    set({ waitingQueue: newQueue, dragOverIndex: null });
  },

  markPatientMissed: (patientId, reason) => {
    const { currentCall, waitingQueue } = get();
    if (!currentCall || currentCall.patientId !== patientId) return;

    const now = new Date();
    const missedRecord: MissedRecord = {
      id: `miss-${Date.now()}`,
      patientId: currentCall.patientId,
      patientName: currentCall.patientName,
      patientNumber: currentCall.patientNumber,
      departmentId: currentCall.departmentId,
      missedTime: now,
      reason,
      hasReturned: false,
    };

    const updatedQueue = waitingQueue.map((p) =>
      p.id === patientId
        ? { ...p, status: 'missed' as const, missedCount: p.missedCount + 1, missedReason: reason }
        : p
    );

    set({
      currentCall: null,
      missedRecords: [missedRecord, ...get().missedRecords],
      waitingQueue: updatedQueue.filter((p) => p.id !== patientId),
    });
  },

  returnMissedPatient: (recordId) => {
    const { missedRecords, waitingQueue } = get();
    const record = missedRecords.find((r) => r.id === recordId);
    if (!record || record.hasReturned) return;

    const now = new Date();
    const patient = mockPatients.find((p) => p.id === record.patientId);

    const returnedPatient: Patient = patient
      ? { ...patient, status: 'waiting' as const, checkInTime: now, estimatedWaitTime: 5 }
      : {
          id: record.patientId,
          name: record.patientName,
          age: 0,
          gender: 'male',
          patientNumber: record.patientNumber,
          departmentId: record.departmentId,
          priority: 'normal',
          status: 'waiting',
          checkInTime: now,
          estimatedWaitTime: 5,
          missedCount: 1,
        };

    set({
      waitingQueue: [...waitingQueue, returnedPatient],
      missedRecords: missedRecords.map((r) =>
        r.id === recordId ? { ...r, hasReturned: true, returnedTime: now } : r
      ),
    });
  },

  updateExamStatus: (examId, status) => {
    set((state) => ({
      examItems: state.examItems.map((e) => (e.id === examId ? { ...e, status } : e)),
    }));
  },

  getAffectedPatients: (fromIndex, toIndex) => {
    const { waitingQueue } = get();
    if (fromIndex === toIndex) return [];

    const start = Math.min(fromIndex, toIndex);
    const end = Math.max(fromIndex, toIndex);

    return waitingQueue.slice(start, end + 1);
  },
}));
