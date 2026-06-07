import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useClinicStore } from '../../store/useClinicStore';
import { PatientCard } from '../common/PatientCard';
import { Mic, SkipForward, Clock, GripVertical, AlertCircle } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

interface SortablePatientCardProps {
  id: string;
  index: number;
  isAffected: boolean;
}

function SortablePatientCard({ id, index, isAffected }: SortablePatientCardProps) {
  const { waitingQueue, selectedPatient, setSelectedPatient } = useClinicStore();
  const patient = waitingQueue.find((p) => p.id === id);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  if (!patient) return null;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10">
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>
      <div className="pl-8">
        <PatientCard
          patient={patient}
          isSelected={selectedPatient?.id === patient.id}
          isAffected={isAffected}
          onClick={() => setSelectedPatient(selectedPatient?.id === patient.id ? null : patient)}
          queuePosition={index}
        />
      </div>
    </div>
  );
}

export function CallingQueuePanel() {
  const {
    waitingQueue,
    currentCall,
    selectedPatient,
    dragOverIndex,
    setDragOverIndex,
    movePatientInQueue,
    callNextPatient,
    getAffectedPatients,
    markPatientMissed,
  } = useClinicStore();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: { active: { id: string | number } }) => {
    const index = waitingQueue.findIndex((p) => p.id === String(event.active.id));
    setDraggedIndex(index);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      const overIndex = waitingQueue.findIndex((p) => p.id === over.id);
      setDragOverIndex(overIndex);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedIndex(null);
    setDragOverIndex(null);

    if (over && active.id !== over.id) {
      const oldIndex = waitingQueue.findIndex((p) => p.id === active.id);
      const newIndex = waitingQueue.findIndex((p) => p.id === over.id);
      movePatientInQueue(oldIndex, newIndex);
    }
  };

  const affectedPatientIds =
    draggedIndex !== null && dragOverIndex !== null
      ? getAffectedPatients(draggedIndex, dragOverIndex).map((p) => p.id)
      : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Mic className="w-5 h-5 text-blue-600" />
            叫号队列
          </h3>
          <button
            onClick={callNextPatient}
            disabled={waitingQueue.length === 0}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <SkipForward className="w-4 h-4" />
            叫下一位
          </button>
        </div>
      </div>

      {currentCall && (
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-600 font-medium mb-1">当前叫号</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-blue-900">
                  {currentCall.patientNumber} {currentCall.patientName}
                </span>
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full animate-pulse">
                  叫号中
                </span>
              </div>
              <div className="text-xs text-blue-700 mt-1">
                诊室 {currentCall.roomNumber} · {formatTime(currentCall.callTime)} 开始叫号
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => markPatientMissed(currentCall.patientId, '未到场')}
                className="px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
              >
                过号
              </button>
            </div>
          </div>
        </div>
      )}

      {(draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2 text-sm text-amber-800">
          <AlertCircle className="w-4 h-4" />
          <span>
            调整后将影响 <span className="font-bold">{affectedPatientIds.length}</span> 位患者的等待时间
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {waitingQueue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Clock className="w-12 h-12 mb-2 opacity-50" />
            <span>暂无等待患者</span>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={waitingQueue.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {waitingQueue.map((patient, index) => (
                <SortablePatientCard
                  key={patient.id}
                  id={patient.id}
                  index={index}
                  isAffected={affectedPatientIds.includes(patient.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
