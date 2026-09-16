import React, { useState } from 'react';
import { Student, Warden, Staff, Hostel } from '../../types';
import { StudentsTab } from './StudentsTab';
import { WardensTab } from './WardensTab';
import { StaffTab } from './StaffTab';
import { GuardianDrawer } from './GuardianDrawer';
import { Users, ShieldCheck, UserCheck } from 'lucide-react';

interface PersonnelTabProps {
  students: Student[];
  wardens: Warden[];
  staff: Staff[];
  hostels: Hostel[];
  onSaveStudent: (data: Partial<Student>, isEdit: boolean) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
  onSaveWarden: (data: Partial<Warden>, isEdit: boolean) => Promise<void>;
  onDeleteWarden: (id: string) => Promise<void>;
  onSaveStaff: (data: Partial<Staff>, isEdit: boolean) => Promise<void>;
  onDeleteStaff: (id: string) => Promise<void>;
}

export const PersonnelTab: React.FC<PersonnelTabProps> = ({
  students,
  wardens,
  staff,
  hostels,
  onSaveStudent,
  onDeleteStudent,
  onSaveWarden,
  onDeleteWarden,
  onSaveStaff,
  onDeleteStaff,
}) => {
  const [subTab, setSubTab] = useState<'students' | 'wardens' | 'staff'>('students');
  const [guardianStudent, setGuardianStudent] = useState<Student | null>(null);

  return (
    <div>
      {/* Sub Navigation Pills for Personnel */}
      <div className="tab-pills">
        <button
          className={`tab-pill ${subTab === 'students' ? 'active' : ''}`}
          onClick={() => setSubTab('students')}
        >
          <Users size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Students ({students.length})
        </button>
        <button
          className={`tab-pill ${subTab === 'wardens' ? 'active' : ''}`}
          onClick={() => setSubTab('wardens')}
        >
          <ShieldCheck size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Wardens ({wardens.length})
        </button>
        <button
          className={`tab-pill ${subTab === 'staff' ? 'active' : ''}`}
          onClick={() => setSubTab('staff')}
        >
          <UserCheck size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Staff & Crew ({staff.length})
        </button>
      </div>

      {subTab === 'students' && (
        <StudentsTab
          students={students}
          onSaveStudent={onSaveStudent}
          onDeleteStudent={onDeleteStudent}
          onViewGuardians={setGuardianStudent}
        />
      )}

      {subTab === 'wardens' && (
        <WardensTab
          wardens={wardens}
          hostels={hostels}
          onSaveWarden={onSaveWarden}
          onDeleteWarden={onDeleteWarden}
        />
      )}

      {subTab === 'staff' && (
        <StaffTab
          staff={staff}
          hostels={hostels}
          onSaveStaff={onSaveStaff}
          onDeleteStaff={onDeleteStaff}
        />
      )}

      {/* Guardian Context Drawer */}
      <GuardianDrawer
        student={guardianStudent}
        onClose={() => setGuardianStudent(null)}
      />
    </div>
  );
};
