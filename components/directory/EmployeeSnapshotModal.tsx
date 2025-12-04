

import React, { useMemo } from 'react';
import type { Employee } from '../../types';
import { Modal } from '../common/Modal';
import { useAppState } from '../../hooks/useAppContext';
import { GoalStatus, AttendanceStatus } from '../../types';

interface EmployeeSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const StatDisplay: React.FC<{ label: string, value: string | number, colorClass?: string }> = ({ label, value, colorClass = 'text-primary' }) => (
    <div className="text-center bg-neutral-100 p-3 rounded-lg">
        <p className="text-sm text-neutral-600">{label}</p>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
);

const RadarChart: React.FC<{ data: { label: string, score: number }[] }> = ({ data }) => {
    const size = 200;
    const center = size / 2;
    const numAxes = data.length;
    
    const points = useMemo(() => {
        return data.map(({ score }, i) => {
            const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
            const radius = (score / 5) * (center - 20); // Max score is 5
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    }, [data, center, numAxes]);

    const axisLines = data.map((_, i) => {
        const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
        const radius = center - 20;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return { x, y };
    });
    
    const axisLabels = data.map(({ label }, i) => {
        const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
        const radius = center - 5;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        let textAnchor = 'middle';
        if (x < center - 5) textAnchor = 'end';
        if (x > center + 5) textAnchor = 'start';
        return { x, y, label, textAnchor };
    });

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g>
                {axisLines.map((point, i) => (
                    <line key={i} x1={center} y1={center} x2={point.x} y2={point.y} stroke="#D1D5DB" strokeWidth="1" />
                ))}
            </g>
             <g>
                {axisLabels.map(({ x, y, label, textAnchor }, i) => (
                   <text key={i} x={x} y={y} fontSize="10" textAnchor={textAnchor} fill="#4B5563">{label}</text>
                ))}
            </g>
            <polygon points={points} fill="rgba(0, 82, 204, 0.4)" stroke="#0052cc" strokeWidth="2" />
        </svg>
    );
};


export const EmployeeSnapshotModal: React.FC<EmployeeSnapshotModalProps> = ({ isOpen, onClose, employee }) => {
    const { performanceGoals, performanceReviews, attendanceRecords } = useAppState();

    const snapshotData = useMemo(() => {
        if (!employee) return null;

        const myReviews = performanceReviews.filter(r => r.employeeId === employee.id).sort((a,b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());
        const latestReview = myReviews[0];

        const myGoals = performanceGoals.filter(g => g.employeeId === employee.id);
        const completedGoals = myGoals.filter(g => g.status === GoalStatus.COMPLETED).length;
        const goalCompletionRate = myGoals.length > 0 ? Math.round((completedGoals / myGoals.length) * 100) : 0;

        const myAttendance = attendanceRecords.filter(r => r.employeeId === employee.id && r.status !== AttendanceStatus.ON_LEAVE);
        const presentDays = myAttendance.filter(r => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE).length;
        const attendanceRate = myAttendance.length > 0 ? Math.round((presentDays / myAttendance.length) * 100) : 100;

        const performanceMap: Record<number, { index: string, color: string }> = {
            1: { index: "Needs Improvement", color: "text-red-600" },
            2: { index: "Below Expectations", color: "text-orange-600" },
            3: { index: "Meets Expectations", color: "text-yellow-600" },
            4: { index: "Exceeds Expectations", color: "text-green-600" },
            5: { index: "Outstanding", color: "text-primary" },
        };
        const performance = latestReview?.rating ? performanceMap[latestReview.rating] : { index: "N/A", color: "text-neutral-600" };
        
        // Simulate competency scores from overall rating
        const rating = latestReview?.rating || 3;
        const competencyScores = [
            { label: 'Technical', score: rating + (Math.random() > 0.5 ? 0.5 : -0.5) },
            { label: 'Communication', score: rating + (Math.random() > 0.5 ? 0.5 : -0.5) },
            { label: 'Teamwork', score: rating + (Math.random() > 0.5 ? 0.5 : -0.5) },
            { label: 'Leadership', score: rating + (Math.random() > 0.5 ? 0.5 : -0.5) },
            { label: 'Initiative', score: rating + (Math.random() > 0.5 ? 0.5 : -0.5) },
        ].map(s => ({...s, score: Math.max(1, Math.min(5, s.score))})); // Clamp scores between 1 and 5
        

        return {
            ...employee,
            goalCompletionRate,
            attendanceRate,
            performance,
            latestReview,
            competencyScores
        };
    }, [employee, performanceGoals, performanceReviews, attendanceRecords]);

    if (!isOpen || !snapshotData) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Employee Snapshot" size="lg">
            <div className="space-y-6">
                <div className="text-center p-4 border-b">
                    <img src={snapshotData.avatarUrl} alt={snapshotData.name} className="w-24 h-24 rounded-full mx-auto mb-2" />
                    <h3 className="text-xl font-bold">{snapshotData.name}</h3>
                    <p className="text-neutral-600">{snapshotData.position} - {snapshotData.department}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatDisplay label="Performance Index" value={snapshotData.performance.index} colorClass={snapshotData.performance.color} />
                    <StatDisplay label="Goal Completion" value={`${snapshotData.goalCompletionRate}%`} />
                    <StatDisplay label="Attendance Rate" value={`${snapshotData.attendanceRate}%`} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                     <div className="flex flex-col items-center">
                        <h4 className="font-semibold mb-2">Core Competencies</h4>
                        <RadarChart data={snapshotData.competencyScores} />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold">Manager's Feedback</h4>
                            <p className="text-sm text-neutral-600 p-3 bg-neutral-50 rounded-md mt-1 italic">
                                {snapshotData.latestReview?.managerAssessment || "No recent feedback available."}
                            </p>
                        </div>
                         <div>
                            <h4 className="font-semibold">Self-Assessment</h4>
                            <p className="text-sm text-neutral-600 p-3 bg-neutral-50 rounded-md mt-1 italic">
                                {snapshotData.latestReview?.selfAssessment || "No recent self-assessment."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
