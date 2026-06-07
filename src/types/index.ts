export type PatientStatus = 'waiting' | 'called' | 'examing' | 'in-transit' | 'missed' | 'returned' | 'done';

export type Priority = 'normal' | 'elderly' | 'child' | 'emergency' | 'vip';

export type CongestionLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Department {
  id: string;
  name: string;
  doctorName: string;
  roomNumber: string;
  congestionLevel: CongestionLevel;
  waitingCount: number;
  avgWaitTime: number;
  seatTotal: number;
  seatUsed: number;
  isActive: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  departmentId: string;
  priority: Priority;
  status: PatientStatus;
  checkInTime: Date;
  calledTime?: Date;
  estimatedWaitTime: number;
  actualWaitTime?: number;
  examType?: string;
  examRoom?: string;
  examDepartment?: string;
  examDepartureTime?: Date;
  examEstimatedReturnTime?: Date;
  examReturnReminded?: boolean;
  missedReason?: string;
  missedCount: number;
  notes?: string;
}

export interface ExamItem {
  id: string;
  patientId: string;
  patientName: string;
  examType: string;
  examRoom: string;
  scheduledTime: Date;
  status: 'scheduled' | 'in-transit' | 'in-progress' | 'completed';
  estimatedDuration: number;
}

export interface MissedRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientNumber: string;
  departmentId: string;
  missedTime: Date;
  reason: string;
  hasReturned: boolean;
  returnedTime?: Date;
}

export interface CallRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientNumber: string;
  departmentId: string;
  roomNumber: string;
  callTime: Date;
  callCount: number;
  status: 'calling' | 'completed' | 'missed';
}
