



import React, { createContext, useState, useMemo, ReactNode, useCallback } from 'react';
import type { Tenant, Employee, LeaveRequest, ClaimRequest, Announcement, AttendanceRecord, DisciplineRecord, PerformanceGoal, PerformanceReview, TrainingCourse, TrainingRequest, TrainingStatus, Asset, AssetStatus, JobPosting, Candidate, CandidateStage, JobStatus, PayrollRun, PayrollStatus, PayrollRecord, CompanyProfile, Survey, SurveyResponse, SurveyAnswer, OnboardingProcess, OnboardingTaskStatus, HealthLog } from '../types';
import { RequestStatus, AttendanceStatus, DisciplineActionType, PayrollStatus as PayrollStatusEnum, OnboardingTaskStatus as OnboardingTaskStatusEnum, OnboardingProcessStatus } from '../types';
import { MOCK_TENANTS, MOCK_EMPLOYEES, MOCK_LEAVE_REQUESTS, MOCK_CLAIM_REQUESTS, MOCK_ANNOUNCEMENTS, MOCK_ATTENDANCE_RECORDS, MOCK_DISCIPLINE_RECORDS, MOCK_PERFORMANCE_GOALS, MOCK_PERFORMANCE_REVIEWS, MOCK_TRAINING_COURSES, MOCK_TRAINING_REQUESTS, MOCK_ASSETS, MOCK_JOB_POSTINGS, MOCK_CANDIDATES, MOCK_PAYROLL_RUNS, MOCK_COMPANY_PROFILES, MOCK_SURVEYS, MOCK_SURVEY_RESPONSES, MOCK_ONBOARDING_PROCESSES, MOCK_HEALTH_LOGS } from '../services/mockData';
import { getEpfContribution, getSocsoContribution, getEisContribution, getPcbContribution } from '../services/payrollService';

interface AppState {
  currentUser: Employee;
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  claimRequests: ClaimRequest[];
  announcements: Announcement[];
  attendanceRecords: AttendanceRecord[];
  disciplineRecords: DisciplineRecord[];
  performanceGoals: PerformanceGoal[];
  performanceReviews: PerformanceReview[];
  trainingCourses: TrainingCourse[];
  trainingRequests: TrainingRequest[];
  assets: Asset[];
  jobPostings: JobPosting[];
  candidates: Candidate[];
  payrollRuns: PayrollRun[];
  surveys: Survey[];
  surveyResponses: SurveyResponse[];
  onboardingProcesses: OnboardingProcess[];
  healthLogs: HealthLog[];
  tenants: Tenant[];
  currentTenantId: string;
  companyProfile: CompanyProfile;
}

interface AppActions {
  switchTenant: (tenantId: string) => void;
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'employeeId' | 'tenantId'>) => void;
  addClaimRequest: (request: Omit<ClaimRequest, 'id' | 'employeeId' | 'tenantId'>) => void;
  updateRequestStatus: (requestId: string, newStatus: RequestStatus, type: 'leave' | 'claim') => void;
  addEmployee: (employee: Omit<Employee, 'id' | 'tenantId'>) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (employeeId: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'tenantId' | 'authorId' | 'createdAt'>) => void;
  addOrUpdateAttendanceRecord: (record: Omit<AttendanceRecord, 'id' | 'tenantId'>) => void;
  addDisciplineRecord: (record: Omit<DisciplineRecord, 'id' | 'tenantId'>) => void;
  recordAttendanceWithQr: (qrData: string) => Promise<{success: boolean; message: string;}>;
  addPerformanceGoal: (goal: Omit<PerformanceGoal, 'id' | 'tenantId'>) => void;
  updatePerformanceGoal: (goal: PerformanceGoal) => void;
  updatePerformanceReview: (review: PerformanceReview) => void;
  addTrainingRequest: (request: Omit<TrainingRequest, 'id' | 'tenantId' | 'employeeId' | 'requestDate' >) => void;
  updateTrainingRequestStatus: (requestId: string, newStatus: TrainingStatus) => void;
  addAsset: (asset: Omit<Asset, 'id' | 'tenantId' | 'status'>) => void;
  assignAsset: (assetId: string, employeeId: string) => void;
  unassignAsset: (assetId: string) => void;
  addJobPosting: (jobPosting: Omit<JobPosting, 'id' | 'tenantId' | 'status'>) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'tenantId' | 'stage' | 'notes'>) => void;
  updateCandidateStage: (candidateId: string, newStage: CandidateStage) => void;
  runPayroll: (month: number, year: number) => void;
  finalizePayroll: (runId: string) => void;
  updateCompanyProfile: (profile: CompanyProfile) => void;
  submitSurveyResponse: (surveyId: string, answers: SurveyAnswer[]) => void;
  updateOnboardingTaskStatus: (processId: string, taskId: string, newStatus: OnboardingTaskStatus) => void;
  addHealthLog: (log: Omit<HealthLog, 'id' | 'tenantId' | 'employeeId'>) => void;
}

export const AppStateContext = createContext<AppState | undefined>(undefined);
export const AppActionsContext = createContext<AppActions | undefined>(undefined);

export const AppContextProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [tenants] = useState<Tenant[]>(MOCK_TENANTS);
    const [currentTenantId, setCurrentTenantId] = useState<string>(tenants[0].id);
    
    const [allEmployees, setAllEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
    const [allLeaveRequests, setAllLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
    const [allClaimRequests, setAllClaimRequests] = useState<ClaimRequest[]>(MOCK_CLAIM_REQUESTS);
    const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
    const [allAttendanceRecords, setAllAttendanceRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE_RECORDS);
    const [allDisciplineRecords, setAllDisciplineRecords] = useState<DisciplineRecord[]>(MOCK_DISCIPLINE_RECORDS);
    const [allPerformanceGoals, setAllPerformanceGoals] = useState<PerformanceGoal[]>(MOCK_PERFORMANCE_GOALS);
    const [allPerformanceReviews, setAllPerformanceReviews] = useState<PerformanceReview[]>(MOCK_PERFORMANCE_REVIEWS);
    const [allTrainingCourses, setAllTrainingCourses] = useState<TrainingCourse[]>(MOCK_TRAINING_COURSES);
    const [allTrainingRequests, setAllTrainingRequests] = useState<TrainingRequest[]>(MOCK_TRAINING_REQUESTS);
    const [allAssets, setAllAssets] = useState<Asset[]>(MOCK_ASSETS);
    const [allJobPostings, setAllJobPostings] = useState<JobPosting[]>(MOCK_JOB_POSTINGS);
    const [allCandidates, setAllCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
    const [allPayrollRuns, setAllPayrollRuns] = useState<PayrollRun[]>(MOCK_PAYROLL_RUNS);
    const [allCompanyProfiles, setAllCompanyProfiles] = useState<CompanyProfile[]>(MOCK_COMPANY_PROFILES);
    const [allSurveys, setAllSurveys] = useState<Survey[]>(MOCK_SURVEYS);
    const [allSurveyResponses, setAllSurveyResponses] = useState<SurveyResponse[]>(MOCK_SURVEY_RESPONSES);
    const [allOnboardingProcesses, setAllOnboardingProcesses] = useState<OnboardingProcess[]>(MOCK_ONBOARDING_PROCESSES);
    const [allHealthLogs, setAllHealthLogs] = useState<HealthLog[]>(MOCK_HEALTH_LOGS);

    // Memoized state slices based on currentTenantId
    const employees = useMemo(() => allEmployees.filter(e => e.tenantId === currentTenantId), [allEmployees, currentTenantId]);
    const currentUser = useMemo(() => employees.find(e => e.isManager) || employees[0], [employees]);
    const leaveRequests = useMemo(() => allLeaveRequests.filter(lr => lr.tenantId === currentTenantId), [allLeaveRequests, currentTenantId]);
    const claimRequests = useMemo(() => allClaimRequests.filter(cr => cr.tenantId === currentTenantId), [allClaimRequests, currentTenantId]);
    const announcements = useMemo(() => allAnnouncements.filter(a => a.tenantId === currentTenantId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [allAnnouncements, currentTenantId]);
    const attendanceRecords = useMemo(() => allAttendanceRecords.filter(ar => ar.tenantId === currentTenantId), [allAttendanceRecords, currentTenantId]);
    const disciplineRecords = useMemo(() => allDisciplineRecords.filter(dr => dr.tenantId === currentTenantId), [allDisciplineRecords, currentTenantId]);
    const performanceGoals = useMemo(() => allPerformanceGoals.filter(g => g.tenantId === currentTenantId), [allPerformanceGoals, currentTenantId]);
    const performanceReviews = useMemo(() => allPerformanceReviews.filter(r => r.tenantId === currentTenantId), [allPerformanceReviews, currentTenantId]);
    const trainingCourses = useMemo(() => allTrainingCourses.filter(c => c.tenantId === currentTenantId), [allTrainingCourses, currentTenantId]);
    const trainingRequests = useMemo(() => allTrainingRequests.filter(r => r.tenantId === currentTenantId), [allTrainingRequests, currentTenantId]);
    const assets = useMemo(() => allAssets.filter(a => a.tenantId === currentTenantId), [allAssets, currentTenantId]);
    const jobPostings = useMemo(() => allJobPostings.filter(j => j.tenantId === currentTenantId), [allJobPostings, currentTenantId]);
    const candidates = useMemo(() => allCandidates.filter(c => c.tenantId === currentTenantId), [allCandidates, currentTenantId]);
    const payrollRuns = useMemo(() => allPayrollRuns.filter(p => p.tenantId === currentTenantId), [allPayrollRuns, currentTenantId]);
    const companyProfile = useMemo(() => allCompanyProfiles.find(p => p.tenantId === currentTenantId)!, [allCompanyProfiles, currentTenantId]);
    const surveys = useMemo(() => allSurveys.filter(s => s.tenantId === currentTenantId), [allSurveys, currentTenantId]);
    const surveyResponses = useMemo(() => allSurveyResponses.filter(sr => sr.tenantId === currentTenantId), [allSurveyResponses, currentTenantId]);
    const onboardingProcesses = useMemo(() => allOnboardingProcesses.filter(p => p.tenantId === currentTenantId), [allOnboardingProcesses, currentTenantId]);
    const healthLogs = useMemo(() => allHealthLogs.filter(hl => hl.tenantId === currentTenantId), [allHealthLogs, currentTenantId]);

    const switchTenant = useCallback((tenantId: string) => {
        setCurrentTenantId(tenantId);
    }, []);

    const addLeaveRequest = useCallback((request: Omit<LeaveRequest, 'id' | 'employeeId' | 'tenantId'>) => {
        setAllLeaveRequests(prev => {
            const newRequest: LeaveRequest = {
                ...request,
                id: `LR${Date.now()}`,
                employeeId: currentUser.id,
                tenantId: currentTenantId,
            };
            return [newRequest, ...prev];
        });
    }, [currentUser?.id, currentTenantId]);
    
    const addClaimRequest = useCallback((request: Omit<ClaimRequest, 'id' | 'employeeId' | 'tenantId'>) => {
        setAllClaimRequests(prev => {
            const newRequest: ClaimRequest = {
                ...request,
                id: `CR${Date.now()}`,
                employeeId: currentUser.id,
                tenantId: currentTenantId,
            };
            return [newRequest, ...prev];
        });
    }, [currentUser?.id, currentTenantId]);

    const updateRequestStatus = useCallback((requestId: string, newStatus: RequestStatus, type: 'leave' | 'claim') => {
        if (type === 'leave') {
            setAllLeaveRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req));
        } else {
            setAllClaimRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req));
        }
    }, []);

    const addEmployee = useCallback((employee: Omit<Employee, 'id' | 'tenantId'>) => {
        setAllEmployees(prev => {
            const newEmployee: Employee = {
                ...employee,
                id: `USR${Date.now()}`,
                tenantId: currentTenantId,
                avatarUrl: `https://picsum.photos/seed/${Date.now()}/200`
            };
            return [newEmployee, ...prev];
        });
    }, [currentTenantId]);

    const updateEmployee = useCallback((updatedEmployee: Employee) => {
        setAllEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
    }, []);

    const deleteEmployee = useCallback((employeeId: string) => {
        setAllEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    }, []);

    const addAnnouncement = useCallback((announcement: Omit<Announcement, 'id' | 'tenantId' | 'authorId' | 'createdAt'>) => {
        setAllAnnouncements(prev => {
            const newAnnouncement: Announcement = {
                ...announcement,
                id: `ANN${Date.now()}`,
                tenantId: currentTenantId,
                authorId: currentUser.id,
                createdAt: new Date().toISOString(),
            };
            return [newAnnouncement, ...prev];
        });
    }, [currentUser?.id, currentTenantId]);
    
    const addOrUpdateAttendanceRecord = useCallback((record: Omit<AttendanceRecord, 'id' | 'tenantId'>) => {
        setAllAttendanceRecords(prev => {
            const existingRecordIndex = prev.findIndex(r => r.employeeId === record.employeeId && r.date === record.date);
            if (existingRecordIndex > -1) {
                const updatedRecords = [...prev];
                updatedRecords[existingRecordIndex] = { ...updatedRecords[existingRecordIndex], ...record };
                return updatedRecords;
            } else {
                const newRecord: AttendanceRecord = {
                    ...record, id: `ATT${Date.now()}`, tenantId: currentTenantId,
                };
                return [newRecord, ...prev];
            }
        });
    }, [currentTenantId]);

    const addDisciplineRecord = useCallback((record: Omit<DisciplineRecord, 'id' | 'tenantId'>) => {
        setAllDisciplineRecords(prev => {
             const newRecord: DisciplineRecord = {
                ...record, id: `DIS${Date.now()}`, tenantId: currentTenantId,
            };
            return [newRecord, ...prev]
        });
    }, [currentTenantId]);

    const recordAttendanceWithQr = useCallback(async (qrData: string): Promise<{success: boolean; message: string;}> => {
        try {
            const decoded = atob(qrData);
            const data = JSON.parse(decoded);

            if (data.secret !== 'HR_CORE_SECRET') {
                return { success: false, message: 'Invalid QR Code.' };
            }

            const now = Date.now();
            const qrTimestamp = data.timestamp;
            if (now - qrTimestamp > 40000) { // 40 second validity
                return { success: false, message: 'QR Code has expired. Please scan again.' };
            }

            const today = new Date();
            const dateStr = today.toISOString().split('T')[0];
            const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

            const existingRecord = allAttendanceRecords.find(r => r.employeeId === currentUser.id && r.date === dateStr);
            if (existingRecord?.checkInTime) {
                return { success: false, message: `You have already clocked in at ${existingRecord.checkInTime}.` };
            }
            
            const lateThreshold = new Date(today);
            lateThreshold.setHours(9, 5, 0, 0); // 9:05 AM
            const status = today > lateThreshold ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
            
            addOrUpdateAttendanceRecord({ employeeId: currentUser.id, date: dateStr, status, checkInTime: timeStr });
            return { success: true, message: `Clocked in successfully at ${timeStr}.` };

        } catch (error) {
            console.error("Error processing QR code:", error);
            return { success: false, message: 'Invalid QR code format.' };
        }
    }, [allAttendanceRecords, currentUser?.id, addOrUpdateAttendanceRecord]);
    
    const addPerformanceGoal = useCallback((goal: Omit<PerformanceGoal, 'id' | 'tenantId'>) => {
        setAllPerformanceGoals(prev => {
            const newGoal: PerformanceGoal = {
                ...goal, id: `GOAL${Date.now()}`, tenantId: currentTenantId,
            };
            return [newGoal, ...prev]
        });
    }, [currentTenantId]);

    const updatePerformanceGoal = useCallback((updatedGoal: PerformanceGoal) => {
        setAllPerformanceGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    }, []);
    
    const updatePerformanceReview = useCallback((updatedReview: PerformanceReview) => {
        setAllPerformanceReviews(prev => prev.map(r => r.id === updatedReview.id ? updatedReview : r));
    }, []);

    const addTrainingRequest = useCallback((request: Omit<TrainingRequest, 'id' | 'tenantId' | 'employeeId' | 'requestDate' >) => {
        setAllTrainingRequests(prev => {
             const newRequest: TrainingRequest = {
                ...request,
                id: `TRQ${Date.now()}`,
                tenantId: currentTenantId,
                employeeId: currentUser.id,
                requestDate: new Date().toISOString().split('T')[0],
            };
            return [newRequest, ...prev];
        });
    }, [currentTenantId, currentUser?.id]);

    const updateTrainingRequestStatus = useCallback((requestId: string, newStatus: TrainingStatus) => {
        setAllTrainingRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req));
    }, []);

    const addAsset = useCallback((asset: Omit<Asset, 'id' | 'tenantId' | 'status'>) => {
        setAllAssets(prev => {
            const newAsset: Asset = {
                ...asset, id: `ASSET${Date.now()}`, tenantId: currentTenantId, status: 'In Stock' as AssetStatus,
            };
            return [newAsset, ...prev];
        });
    }, [currentTenantId]);

    const assignAsset = useCallback((assetId: string, employeeId: string) => {
        setAllAssets(prev => prev.map(asset => asset.id === assetId ? { ...asset, status: 'Assigned' as AssetStatus, assignedTo: employeeId } : asset));
    }, []);

    const unassignAsset = useCallback((assetId: string) => {
        setAllAssets(prev => prev.map(asset => asset.id === assetId ? { ...asset, status: 'In Stock' as AssetStatus, assignedTo: undefined } : asset));
    }, []);

    const addJobPosting = useCallback((jobPosting: Omit<JobPosting, 'id' | 'tenantId' | 'status'>) => {
        setAllJobPostings(prev => {
            const newJob: JobPosting = {
                ...jobPosting, id: `JOB${Date.now()}`, tenantId: currentTenantId, status: 'Open' as JobStatus,
            };
            return [newJob, ...prev];
        });
    }, [currentTenantId]);
    
    const addCandidate = useCallback((candidate: Omit<Candidate, 'id' | 'tenantId' | 'stage' | 'notes'>) => {
        setAllCandidates(prev => {
            const newCandidate: Candidate = {
                ...candidate,
                id: `CAND${Date.now()}`,
                tenantId: currentTenantId,
                stage: 'Applied' as CandidateStage,
                notes: [],
                resumeUrl: 'placeholder.pdf' // Placeholder
            };
            return [newCandidate, ...prev];
        });
    }, [currentTenantId]);

    const updateCandidateStage = useCallback((candidateId: string, newStage: CandidateStage) => {
        setAllCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage: newStage } : c));
    }, []);

    const runPayroll = useCallback((month: number, year: number) => {
        const payrollEmployees = allEmployees.filter(e => e.tenantId === currentTenantId);
        const records: PayrollRecord[] = payrollEmployees.map(employee => {
            const salary = employee.salary;
            const epf = getEpfContribution(salary);
            const socso = getSocsoContribution(salary);
            const eis = getEisContribution(salary);
            const pcb = getPcbContribution(salary, epf.employee, { lifeInsurance: 0, lifestyle: 0, medicalParents: 0, education: 0 });
            const totalDeductions = epf.employee + socso.employee + eis.employee + pcb;
            const netSalary = salary - totalDeductions;
            
            return {
                employeeId: employee.id, grossSalary: salary, epfEmployee: epf.employee, epfEmployer: epf.employer,
                socsoEmployee: socso.employee, socsoEmployer: socso.employer, eisEmployee: eis.employee, eisEmployer: eis.employer,
                pcb, totalDeductions, netSalary,
            };
        });

        const newRun: PayrollRun = {
            id: `PAY${year}${String(month).padStart(2,'0')}`, tenantId: currentTenantId, month, year,
            status: PayrollStatusEnum.DRAFT, records, createdAt: new Date().toISOString(),
        };

        setAllPayrollRuns(prev => [newRun, ...prev.filter(p => p.id !== newRun.id)]);
    }, [allEmployees, currentTenantId]);

    const finalizePayroll = useCallback((runId: string) => {
        setAllPayrollRuns(prev => prev.map(run => run.id === runId ? { ...run, status: PayrollStatusEnum.FINALIZED } : run));
    }, []);

    const updateCompanyProfile = useCallback((updatedProfile: CompanyProfile) => {
        setAllCompanyProfiles(prev => prev.map(p => p.tenantId === updatedProfile.tenantId ? updatedProfile : p));
    }, []);
    
    const submitSurveyResponse = useCallback((surveyId: string, answers: SurveyAnswer[]) => {
        setAllSurveyResponses(prev => {
             const newResponse: SurveyResponse = {
                id: `S_RES_${Date.now()}`, surveyId, employeeId: currentUser.id,
                tenantId: currentTenantId, answers, submittedAt: new Date().toISOString(),
            };
            return [...prev, newResponse];
        });
    }, [currentUser?.id, currentTenantId]);

    const updateOnboardingTaskStatus = useCallback((processId: string, taskId: string, newStatus: OnboardingTaskStatus) => {
        setAllOnboardingProcesses(prev => prev.map(process => {
            if (process.id === processId) {
                const updatedTasks = process.tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task);
                const allTasksCompleted = updatedTasks.every(t => t.status === OnboardingTaskStatusEnum.COMPLETED);
                return { ...process, tasks: updatedTasks, status: allTasksCompleted ? OnboardingProcessStatus.COMPLETED : OnboardingProcessStatus.IN_PROGRESS };
            }
            return process;
        }));
    }, []);

    const addHealthLog = useCallback((log: Omit<HealthLog, 'id' | 'tenantId' | 'employeeId'>) => {
        setAllHealthLogs(prev => {
            const newLog: HealthLog = {
                ...log,
                id: `HL${Date.now()}`,
                employeeId: currentUser.id,
                tenantId: currentTenantId,
            };
            // Replace if a log for the same employee on the same day exists
            const otherLogs = prev.filter(l => !(l.employeeId === newLog.employeeId && l.date === newLog.date));
            return [newLog, ...otherLogs];
        });
    }, [currentUser?.id, currentTenantId]);

    const appState = useMemo(() => ({
        currentUser, employees, leaveRequests, claimRequests, announcements, attendanceRecords, disciplineRecords,
        performanceGoals, performanceReviews, trainingCourses, trainingRequests, assets, jobPostings,
        candidates, payrollRuns, surveys, surveyResponses, onboardingProcesses, healthLogs, tenants, currentTenantId, companyProfile,
    }), [currentUser, employees, leaveRequests, claimRequests, announcements, attendanceRecords, disciplineRecords,
         performanceGoals, performanceReviews, trainingCourses, trainingRequests, assets, jobPostings, candidates,
         payrollRuns, surveys, surveyResponses, onboardingProcesses, healthLogs, tenants, currentTenantId, companyProfile]);

    const appActions = useMemo(() => ({
        switchTenant, addLeaveRequest, addClaimRequest, updateRequestStatus, addEmployee, updateEmployee,
        deleteEmployee, addAnnouncement, addOrUpdateAttendanceRecord, addDisciplineRecord, recordAttendanceWithQr,
        addPerformanceGoal, updatePerformanceGoal, updatePerformanceReview, addTrainingRequest, updateTrainingRequestStatus,
        addAsset, assignAsset, unassignAsset, addJobPosting, addCandidate, updateCandidateStage,
        runPayroll, finalizePayroll, updateCompanyProfile, submitSurveyResponse, updateOnboardingTaskStatus,
        addHealthLog,
    }), [switchTenant, addLeaveRequest, addClaimRequest, updateRequestStatus, addEmployee, updateEmployee,
         deleteEmployee, addAnnouncement, addOrUpdateAttendanceRecord, addDisciplineRecord, recordAttendanceWithQr,
         addPerformanceGoal, updatePerformanceGoal, updatePerformanceReview, addTrainingRequest, updateTrainingRequestStatus,
         addAsset, assignAsset, unassignAsset, addJobPosting, addCandidate, updateCandidateStage,
         runPayroll, finalizePayroll, updateCompanyProfile, submitSurveyResponse, updateOnboardingTaskStatus,
         addHealthLog]);


    return (
        <AppStateContext.Provider value={appState}>
            <AppActionsContext.Provider value={appActions}>
                {children}
            </AppActionsContext.Provider>
        </AppStateContext.Provider>
    );
};