import type { Priority, PatientStatus, CongestionLevel, ExamItem } from '../types';

export const formatWaitTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} 分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} 小时 ${mins} 分钟` : `${hours} 小时`;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
};

export const getPriorityLabel = (priority: Priority): string => {
  const labels: Record<Priority, string> = {
    normal: '普通',
    elderly: '老人',
    child: '儿童',
    emergency: '急诊',
    vip: 'VIP',
  };
  return labels[priority];
};

export const getPriorityColor = (priority: Priority): string => {
  const colors: Record<Priority, string> = {
    normal: 'bg-gray-100 text-gray-600',
    elderly: 'bg-amber-50 text-amber-700',
    child: 'bg-pink-50 text-pink-700',
    emergency: 'bg-red-50 text-red-700',
    vip: 'bg-purple-50 text-purple-700',
  };
  return colors[priority];
};

export const getStatusLabel = (status: PatientStatus): string => {
  const labels: Record<PatientStatus, string> = {
    waiting: '候诊中',
    called: '已叫号',
    examing: '检查中',
    'in-transit': '检查途中',
    missed: '已过号',
    returned: '已回归',
    done: '已完成',
  };
  return labels[status];
};

export const getStatusColor = (status: PatientStatus): string => {
  const colors: Record<PatientStatus, string> = {
    waiting: 'bg-blue-50 text-blue-700',
    called: 'bg-green-50 text-green-700',
    examing: 'bg-indigo-50 text-indigo-700',
    'in-transit': 'bg-orange-50 text-orange-700',
    missed: 'bg-red-50 text-red-700',
    returned: 'bg-teal-50 text-teal-700',
    done: 'bg-gray-50 text-gray-600',
  };
  return colors[status];
};

export const getCongestionLabel = (level: CongestionLevel): string => {
  const labels: Record<CongestionLevel, string> = {
    low: '通畅',
    medium: '适中',
    high: '拥挤',
    critical: '爆满',
  };
  return labels[level];
};

export const getCongestionColor = (level: CongestionLevel): string => {
  const colors: Record<CongestionLevel, string> = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
  };
  return colors[level];
};

export const getExamStatusLabel = (status: ExamItem['status']): string => {
  const labels = {
    scheduled: '待检查',
    'in-transit': '前往途中',
    'in-progress': '检查中',
    completed: '已完成',
  };
  return labels[status];
};

export const getExamStatusColor = (status: ExamItem['status']): string => {
  const colors = {
    scheduled: 'bg-gray-100 text-gray-600',
    'in-transit': 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
  };
  return colors[status];
};

export const getElapsedMinutes = (startTime: Date): number => {
  return Math.floor((Date.now() - startTime.getTime()) / (1000 * 60));
};

export const getRemainingMinutes = (targetTime: Date): number => {
  return Math.ceil((targetTime.getTime() - Date.now()) / (1000 * 60));
};

export const isExamOverdue = (estimatedReturnTime: Date): boolean => {
  return Date.now() > estimatedReturnTime.getTime();
};

export const formatExamReturnTime = (estimatedReturnTime: Date): string => {
  const remaining = getRemainingMinutes(estimatedReturnTime);
  if (remaining <= 0) {
    return '已超时';
  }
  if (remaining < 60) {
    return `预计 ${remaining} 分钟后返回`;
  }
  const hours = Math.floor(remaining / 60);
  const mins = remaining % 60;
  return mins > 0 ? `预计 ${hours} 小时 ${mins} 分钟后返回` : `预计 ${hours} 小时后返回`;
};
