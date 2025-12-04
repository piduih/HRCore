

import React, { useState, useMemo } from 'react';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import type { AttendanceRecord, DisciplineRecord } from '../../types';
import { AttendanceStatus, DisciplineActionType } from '../../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Page } from '../../App';
import { generateContent } from '../../services/geminiService';

// Helper to get days in a month for the calendar
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const statusColors: Record<AttendanceStatus, { bg: string; text: string; border: string }> = {
    [AttendanceStatus.PRESENT]: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    [AttendanceStatus.ABSENT]: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
    [AttendanceStatus.LATE]: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
    [AttendanceStatus.HALF_DAY]: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    [AttendanceStatus.ON_LEAVE]: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
};

const AttendanceFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    employeeId: string;
    selectedDate: string;
}> = ({ isOpen, onClose, employeeId, selectedDate }) => {
    const { addOrUpdateAttendanceRecord } = useAppActions();
    const [status, setStatus] = useState<AttendanceStatus>(AttendanceStatus.PRESENT);
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addOrUpdateAttendanceRecord({
            employeeId,
            date: selectedDate,
            status,
            notes,
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Log Attendance for ${selectedDate}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as AttendanceStatus)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                        {Object.values(AttendanceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Notes (Optional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                </div>
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Modal>
    );
};

const AiPromptModal: React.FC<{
    onGenerate: (content: string) => void,
    onClose: () => void
}> = ({ onGenerate, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        const fullPrompt = `Generate a formal, professional description for a disciplinary record based on this topic: "${prompt}". The tone should be firm but fair, suitable for an official HR record.`;
        const result = await generateContent(fullPrompt);
        onGenerate(result);
        setIsLoading(false);
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Generate Description with AI">
            <div className="space-y-4">
                <div>
                    <label htmlFor="ai-prompt" className="block text-sm font-medium text-neutral-700">Describe the incident</label>
                    <textarea
                        id="ai-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        placeholder="e.g., Verbal warning for consistent lateness on Monday and Tuesday."
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleGenerate} disabled={isLoading}>
                        {isLoading ? 'Generating...' : 'Generate'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const DisciplineFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    employeeId: string;
}> = ({ isOpen, onClose, employeeId }) => {
    const { addDisciplineRecord } = useAppActions();
    const [actionType, setActionType] = useState<DisciplineActionType>(DisciplineActionType.VERBAL_WARNING);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [documentName, setDocumentName] = useState<string | undefined>();
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!description.trim()) return;
        addDisciplineRecord({ employeeId, date, actionType, description, documentName });
        onClose();
    };

    return (
        <>
        <Modal isOpen={isOpen} onClose={onClose} title="Add Discipline Record">
             <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Action Type</label>
                        <select value={actionType} onChange={e => setActionType(e.target.value as DisciplineActionType)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                            {Object.values(DisciplineActionType).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-neutral-700">Description</label>
                        <Button type="button" size="sm" variant="secondary" onClick={() => setIsAiModalOpen(true)}>
                            <Icon name="bot" className="w-4 h-4 mr-1" />
                            Generate with AI
                        </Button>
                    </div>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder="Describe the incident and action taken..."/>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Add Record</Button>
                </div>
             </form>
        </Modal>
        {isAiModalOpen && (
            <AiPromptModal
                onClose={() => setIsAiModalOpen(false)}
                onGenerate={(generatedContent) => setDescription(generatedContent)}
            />
        )}
        </>
    );
};

interface AttendanceDisciplineProps {
  setActivePage: (page: Page) => void;
}

export const AttendanceDiscipline: React.FC<AttendanceDisciplineProps> = ({ setActivePage }) => {
    const { currentUser, employees, attendanceRecords, disciplineRecords } = useAppState();
    const [activeTab, setActiveTab] = useState('attendance');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
    const [currentDate, setCurrentDate] = useState(new Date());

    const [isAttendanceModalOpen, setAttendanceModalOpen] = useState(false);
    const [isDisciplineModalOpen, setDisciplineModalOpen] = useState(false);
    const [isQrDisplayModalOpen, setQrDisplayModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    const teamMembers = useMemo(() => employees.filter(e => e.managerId === currentUser.id), [employees, currentUser.id]);

    const handleDateChange = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };
    
    const handleDayClick = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate(dateStr);
        setAttendanceModalOpen(true);
    }
    
    if (!currentUser.isManager) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold">Access Denied</h2>
                <p className="text-neutral-500 mt-2">This feature is available for managers only.</p>
            </div>
        );
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const calendarDays = Array(daysInMonth).fill(0).map((_, i) => i + 1);
    const emptyDays = Array(firstDay).fill(null);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const employeeRecords = attendanceRecords.filter(r => r.employeeId === selectedEmployeeId);
    
    const recordsByDate = useMemo(() => {
        return employeeRecords.reduce((acc, record) => {
            acc[record.date] = record;
            return acc;
        }, {} as Record<string, AttendanceRecord>);
    }, [employeeRecords]);
    
    const employeeDisciplineRecords = disciplineRecords
        .filter(r => r.employeeId === selectedEmployeeId)
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Attendance & Discipline</h2>
                    <p className="text-neutral-500">Monitor team attendance and manage disciplinary records.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setQrDisplayModalOpen(true)}>
                        <Icon name="qrcode" className="w-5 h-5 mr-2" />
                        Display QR Code
                    </Button>
                    <Button variant="secondary" onClick={() => setActivePage(Page.ATTENDANCE_REPORT)}>
                        View Report
                    </Button>
                </div>
            </div>

             <Card className="p-4 sm:p-6">
                 <div className="max-w-xs">
                    <label htmlFor="employee" className="block text-sm font-medium text-neutral-700">Select Employee</label>
                    <select id="employee" value={selectedEmployeeId} onChange={e => setSelectedEmployeeId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                        <option value="" disabled>-- Select an employee --</option>
                        {teamMembers.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                    </select>
                </div>
             </Card>

            {selectedEmployeeId && (
            <Card>
                <div className="border-b border-neutral-200">
                    <nav className="-mb-px flex space-x-6 px-6">
                        <button onClick={() => setActiveTab('attendance')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'attendance' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>
                            Attendance
                        </button>
                        <button onClick={() => setActiveTab('discipline')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'discipline' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>
                            Discipline Log
                        </button>
                    </nav>
                </div>

                {activeTab === 'attendance' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <Button variant="secondary" size="sm" onClick={() => handleDateChange(-1)}>Previous Month</Button>
                            <h3 className="font-semibold text-lg">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                            <Button variant="secondary" size="sm" onClick={() => handleDateChange(1)}>Next Month</Button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-neutral-600">
                            {weekdays.map(day => <div key={day} className="py-2">{day}</div>)}
                        </div>
                         <div className="grid grid-cols-7 gap-1">
                            {emptyDays.map((_, i) => <div key={`empty-${i}`} className="border rounded-md min-h-[100px]"></div>)}
                            {calendarDays.map(day => {
                                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const record = recordsByDate[dateStr];
                                const color = record ? statusColors[record.status] : { bg: 'bg-white', text: 'text-neutral-700', border: 'border-neutral-200' };
                                return (
                                     <div key={day} onClick={() => handleDayClick(day)} className={`border rounded-md min-h-[100px] p-2 flex flex-col cursor-pointer hover:bg-neutral-100 transition-colors ${color.border}`}>
                                        <span className={`font-bold ${color.text}`}>{day}</span>
                                        <div className="mt-auto text-center">
                                            {record?.checkInTime && <p className={`text-xs font-semibold ${color.text}`}>{record.checkInTime}</p>}
                                            {record && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}>{record.status}</span>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'discipline' && (
                    <div className="p-6">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">Disciplinary History</h3>
                            <Button onClick={() => setDisciplineModalOpen(true)}>
                                <Icon name="plus" className="w-4 h-4 mr-2" />
                                Add Record
                            </Button>
                        </div>
                         <div className="space-y-4">
                            {employeeDisciplineRecords.length > 0 ? (
                                employeeDisciplineRecords.map(record => (
                                    <div key={record.id} className="p-4 border border-neutral-200 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold">{record.actionType}</p>
                                                <p className="text-sm text-neutral-500">{record.date}</p>
                                            </div>
                                            {record.documentName && <span className="text-sm text-primary flex items-center"><Icon name="paperclip" className="w-4 h-4 mr-1"/>{record.documentName}</span>}
                                        </div>
                                        <p className="text-sm text-neutral-700 mt-2">{record.description}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-neutral-500">No disciplinary records found for this employee.</div>
                            )}
                         </div>
                    </div>
                )}
            </Card>
            )}
            
            {isAttendanceModalOpen && selectedEmployeeId && (
                <AttendanceFormModal
                    isOpen={isAttendanceModalOpen}
                    onClose={() => setAttendanceModalOpen(false)}
                    employeeId={selectedEmployeeId}
                    selectedDate={selectedDate}
                />
            )}
             {isDisciplineModalOpen && selectedEmployeeId && (
                <DisciplineFormModal
                    isOpen={isDisciplineModalOpen}
                    onClose={() => setDisciplineModalOpen(false)}
                    employeeId={selectedEmployeeId}
                />
            )}
            <QRCodeDisplay 
                isOpen={isQrDisplayModalOpen}
                onClose={() => setQrDisplayModalOpen(false)}
            />
        </div>
    );
};