


export enum LeaveType {
  ANNUAL = 'Annual Leave',
  SICK = 'Sick Leave',
  MATERNITY = 'Maternity Leave',
  UNPAID = 'Unpaid Leave',
  EMERGENCY = 'Emergency Leave',
}

export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  HALF_DAY = 'Half Day',
  ON_LEAVE = 'On Leave',
}

export enum DisciplineActionType {
  VERBAL_WARNING = 'Verbal Warning',
  WRITTEN_WARNING = 'Written Warning',
  SHOW_CAUSE = 'Show Cause Letter',
  SUSPENSION = 'Suspension',
}

export enum GoalStatus {
  ON_TRACK = 'On Track',
  AT_RISK = 'At Risk',
  OFF_TRACK = 'Off Track',
  COMPLETED = 'Completed',
}

export enum ReviewStatus {
  PENDING_SELF_ASSESSMENT = 'Pending Self-Assessment',
  PENDING_MANAGER_REVIEW = 'Pending Manager Review',
  COMPLETED = 'Completed',
}

export enum TrainingStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  COMPLETED = 'Completed',
}

export enum AssetStatus {
  IN_STOCK = 'In Stock',
  ASSIGNED = 'Assigned',
  UNDER_REPAIR = 'Under Repair',
  DECOMMISSIONED = 'Decommissioned',
}

export enum JobStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  ON_HOLD = 'On Hold',
}

export enum CandidateStage {
  APPLIED = 'Applied',
  SCREENING = 'Screening',
  INTERVIEW = 'Interview',
  OFFER = 'Offer',
  HIRED = 'Hired',
  REJECTED = 'Rejected',
}

export enum PayrollStatus {
    DRAFT = 'Draft',
    FINALIZED = 'Finalized',
}

export enum SurveyStatus {
    DRAFT = 'Draft',
    ACTIVE = 'Active',
    CLOSED = 'Closed',
}

export enum SurveyQuestionType {
    RATING = 'Rating', // 1-5 scale
    TEXT = 'Text',     // Open-ended feedback
}

export enum OnboardingProcessType {
    ONBOARDING = 'Onboarding',
    OFFBOARDING = 'Offboarding',
}

export enum OnboardingProcessStatus {
    PENDING = 'Pending',
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed',
}

export enum OnboardingTaskStatus {
    TODO = 'To Do',
    COMPLETED = 'Completed',
}

export interface OnboardingTask {
    id: string;
    title: string;
    description: string;
    status: OnboardingTaskStatus;
    dueDate: string;
    assignee: 'Manager' | 'HR' | 'IT' | 'Employee'; // Simplified assignee
}

export interface OnboardingProcess {
    id: string;
    tenantId: string;
    employeeId: string;
    type: OnboardingProcessType;
    status: OnboardingProcessStatus;
    startDate: string;
    tasks: OnboardingTask[];
}

export interface SurveyQuestion {
    id: string;
    text: string;
    type: SurveyQuestionType;
}

export interface Survey {
    id: string;
    tenantId: string;
    title: string;
    description: string;
    questions: SurveyQuestion[];
    status: SurveyStatus;
    createdAt: string;
}

export interface SurveyAnswer {
    questionId: string;
    value: number | string;
}

export interface SurveyResponse {
    id:string;
    surveyId: string;
    tenantId: string;
    employeeId: string;
    answers: SurveyAnswer[];
    submittedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  tenantId: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  avatarUrl: string;
  gender: 'Male' | 'Female';
  joinDate: string; // YYYY-MM-DD
  managerId?: string;
  isManager: boolean;
  annualLeaveEntitled: number;
  annualLeaveTaken: number;
  sickLeaveEntitled: number;
  sickLeaveTaken: number;
  salary: number;
  bankAccount?: string;
  epfNumber?: string;
}

export interface LeaveRequest {
  id: string;
  tenantId: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: RequestStatus;
  days: number;
}

export interface ClaimRequest {
  id: string;
  tenantId: string;
  employeeId: string;
  claimType: string;
  amount: number;
  date: string;
  description: string;
  attachmentName?: string;
  status: RequestStatus;
}

export interface Announcement {
  id: string;
  tenantId: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  tenantId: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime?: string; // HH:MM AM/PM
  checkOutTime?: string; // HH:MM AM/PM
  notes?: string;
}

export interface DisciplineRecord {
  id: string;
  tenantId: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  actionType: DisciplineActionType;
  description: string;
  documentName?: string;
}

export interface PerformanceGoal {
  id: string;
  tenantId: string;
  employeeId: string;
  title: string;
  description: string;
  metric: string; // e.g., "Complete 5 projects", "Achieve 95% customer satisfaction"
  progress: number; // 0-100
  status: GoalStatus;
  dueDate: string; // YYYY-MM-DD
}

export interface PerformanceReview {
  id: string;
  tenantId: string;
  employeeId: string;
  reviewerId: string; // manager's ID
  reviewPeriod: string; // e.g., "Q3 2024", "Annual 2024"
  selfAssessment?: string;
  managerAssessment?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  status: ReviewStatus;
  reviewDate: string; // YYYY-MM-DD
}

export interface TrainingCourse {
  id: string;
  tenantId: string;
  title: string;
  provider: string;
  description: string;
  cost: number;
  duration: string; // e.g., "2 Days", "8 Hours"
  isHrdcClaimable: boolean;
}

export interface TrainingRequest {
  id: string;
  tenantId: string;
  employeeId: string;
  courseId: string;
  status: TrainingStatus;
  requestDate: string; // YYYY-MM-DD
  reason: string;
}

export interface Asset {
  id: string;
  tenantId: string;
  name: string; // e.g., Dell Latitude 7420
  category: string; // e.g., Laptop, Phone, Monitor
  serialNumber: string;
  purchaseDate: string; // YYYY-MM-DD
  status: AssetStatus;
  assignedTo?: string; // employeeId
}

export interface JobPosting {
  id: string;
  tenantId: string;
  title: string;
  department: string;
  description: string;
  status: JobStatus;
}

export interface Candidate {
  id: string;
  tenantId: string;
  jobPostingId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  resumeText?: string;
  stage: CandidateStage;
  notes: string[];
}

export interface PayrollRecord {
    employeeId: string;
    grossSalary: number;
    epfEmployee: number;
    epfEmployer: number;
    socsoEmployee: number;
    socsoEmployer: number;
    eisEmployee: number;
    eisEmployer: number;
    pcb: number;
    totalDeductions: number;
    netSalary: number;
}

export interface PayrollRun {
    id: string;
    tenantId: string;
    month: number; // 1-12
    year: number;
    status: PayrollStatus;
    records: PayrollRecord[];
    createdAt: string;
}

export interface CompanyProfile {
    tenantId: string;
    companyName: string;
    registrationNumber: string;
    address: string;
    companyPhone: string;
    companyEmail: string;
}

export interface HealthLog {
    id: string;
    tenantId: string;
    employeeId: string;
    date: string; // YYYY-MM-DD, represents the end of the week
    stressLevel: number; // 1-10
    workLifeBalance: number; // 1-10
    physicalActivityHours: number; // hours per week
}