





import type { Tenant, Employee, LeaveRequest, ClaimRequest, Announcement, AttendanceRecord, DisciplineRecord, PerformanceGoal, PerformanceReview, TrainingCourse, TrainingRequest, Asset, JobPosting, Candidate, PayrollRun, CompanyProfile, Survey, SurveyResponse, OnboardingProcess, HealthLog } from '../types';
import { LeaveType, RequestStatus, AttendanceStatus, DisciplineActionType, GoalStatus, ReviewStatus, TrainingStatus, AssetStatus, JobStatus, CandidateStage, PayrollStatus, SurveyStatus, SurveyQuestionType, OnboardingProcessType, OnboardingProcessStatus, OnboardingTaskStatus } from '../types';

export const MOCK_TENANTS: Tenant[] = [
  { id: 'TEN001', name: 'Innovate Solutions Sdn Bhd' },
  { id: 'TEN002', name: 'Maju Jaya Holdings' },
];

export const MOCK_COMPANY_PROFILES: CompanyProfile[] = [
    {
        tenantId: 'TEN001',
        companyName: 'Innovate Solutions Sdn Bhd',
        registrationNumber: '202301001234 (1496920-V)',
        address: 'Level 20, Tower 1, Avenue 5, Bangsar South, 59200 Kuala Lumpur',
        companyPhone: '03-1234 5678',
        companyEmail: 'contact@innovate.my',
    },
    {
        tenantId: 'TEN002',
        companyName: 'Maju Jaya Holdings',
        registrationNumber: '202201005678 (1455880-A)',
        address: '1, Jalan Usahawan 5, Kawasan Perindustrian Setapak, 53200 Kuala Lumpur',
        companyPhone: '03-9876 5432',
        companyEmail: 'info@majujaya.com',
    }
];

export const MOCK_EMPLOYEES: Employee[] = [
  // Tenant 1: Innovate Solutions Sdn Bhd
  {
    id: 'USR001',
    tenantId: 'TEN001',
    name: 'Alya Maisarah',
    position: 'HR Manager',
    department: 'Human Resources',
    email: 'alya.maisarah@innovate.my',
    phone: '012-3456789',
    avatarUrl: 'https://picsum.photos/seed/alya/200',
    gender: 'Female',
    joinDate: '2022-01-10',
    isManager: true,
    annualLeaveEntitled: 20,
    annualLeaveTaken: 5,
    sickLeaveEntitled: 14,
    sickLeaveTaken: 2,
    salary: 8000,
    bankAccount: '1234567890 (Maybank)',
    epfNumber: 'EPF123456',
  },
  {
    id: 'USR002',
    tenantId: 'TEN001',
    name: 'Badrul Hisyam',
    position: 'Senior Software Engineer',
    department: 'Technology',
    email: 'badrul.h@innovate.my',
    phone: '019-8765432',
    avatarUrl: 'https://picsum.photos/seed/badrul/200',
    gender: 'Male',
    joinDate: '2021-03-15',
    managerId: 'USR001',
    isManager: false,
    annualLeaveEntitled: 18,
    annualLeaveTaken: 10,
    sickLeaveEntitled: 14,
    sickLeaveTaken: 0,
    salary: 7500,
    bankAccount: '0987654321 (CIMB)',
    epfNumber: 'EPF654321',
  },
  {
    id: 'USR003',
    tenantId: 'TEN001',
    name: 'Catherine Tan',
    position: 'Marketing Executive',
    department: 'Marketing',
    email: 'catherine.t@innovate.my',
    phone: '016-1234567',
    avatarUrl: 'https://picsum.photos/seed/catherine/200',
    gender: 'Female',
    joinDate: '2023-05-20',
    managerId: 'USR001',
    isManager: false,
    annualLeaveEntitled: 16,
    annualLeaveTaken: 4,
    sickLeaveEntitled: 14,
    sickLeaveTaken: 3,
    salary: 4500,
    bankAccount: '1122334455 (Public Bank)',
    epfNumber: 'EPF112233',
  },
  {
    id: 'USR007',
    tenantId: 'TEN001',
    name: 'Ghazali Razak',
    position: 'Junior Marketing Exec',
    department: 'Marketing',
    email: 'ghazali.r@innovate.my',
    phone: '018-1112233',
    avatarUrl: 'https://picsum.photos/seed/ghazali/200',
    gender: 'Male',
    joinDate: '2024-08-27',
    managerId: 'USR001',
    isManager: false,
    annualLeaveEntitled: 14,
    annualLeaveTaken: 0,
    sickLeaveEntitled: 14,
    sickLeaveTaken: 0,
    salary: 3200,
    bankAccount: '5566778899 (Bank Islam)',
    epfNumber: 'EPF556677',
  },
  {
    id: 'USR008',
    tenantId: 'TEN001',
    name: 'Hafiz Ismail',
    position: 'UI/UX Designer',
    department: 'Technology',
    email: 'hafiz.i@innovate.my',
    phone: '012-9988776',
    avatarUrl: 'https://picsum.photos/seed/hafiz/200',
    gender: 'Male',
    joinDate: '2022-11-01',
    managerId: 'USR001',
    isManager: false,
    annualLeaveEntitled: 18,
    annualLeaveTaken: 3,
    sickLeaveEntitled: 14,
    sickLeaveTaken: 1,
    salary: 5800,
    bankAccount: '6677889900 (Maybank)',
    epfNumber: 'EPF667788',
  },
  {
    id: 'USR009',
    tenantId: 'TEN001',
    name: 'Indah Sari',
    position: 'HR Executive',
    department: 'Human Resources',
    email: 'indah.s@innovate.my',
    phone: '013-1122334',
    avatarUrl: 'https://picsum.photos/seed/indah/200',
    gender: 'Female',
    joinDate: '2023-02-15',
    managerId: 'USR001',
    isManager: false,
    annualLeaveEntitled: 16,
    annualLeaveTaken: 6,
    sickLeaveEntitled: 14,
    sickLeaveTaken: 2,
    salary: 4200,
    bankAccount: '7788990011 (CIMB)',
    epfNumber: 'EPF778899',
  },
  // Tenant 2: Maju Jaya Holdings
  {
    id: 'USR004',
    tenantId: 'TEN002',
    name: 'David Kumar',
    position: 'Engineering Lead',
    department: 'Technology',
    email: 'david.k@majujaya.com',
    phone: '011-2345678',
    avatarUrl: 'https://picsum.photos/seed/david/200',
    gender: 'Male',
    joinDate: '2020-07-01',
    isManager: true,
    annualLeaveEntitled: 22,
    annualLeaveTaken: 8,
    sickLeaveEntitled: 14,
    sickLeaveTaken: 1,
    salary: 9000,
    bankAccount: '2233445566 (RHB Bank)',
    epfNumber: 'EPF223344',
  },
  {
    id: 'USR005',
    tenantId: 'TEN002',
    name: 'Emilia Rosli',
    position: 'Marketing Manager',
    department: 'Marketing',
    email: 'emilia.r@majujaya.com',
    phone: '013-5678901',
    avatarUrl: 'https://picsum.photos/seed/emilia/200',
    gender: 'Female',
    joinDate: '2021-09-01',
    isManager: true,
    annualLeaveEntitled: 20,
    annualLeaveTaken: 2,
    sickLeaveEntitled: 14,
    sickLeaveTaken: 0,
    salary: 8500,
    bankAccount: '3344556677 (Hong Leong)',
    epfNumber: 'EPF334455',
  },
   {
    id: 'USR006',
    tenantId: 'TEN002',
    name: 'Farid Ibrahim',
    position: 'Junior Software Engineer',
    department: 'Technology',
    email: 'farid.i@majujaya.com',
    phone: '017-9876543',
    avatarUrl: 'https://picsum.photos/seed/farid/200',
    gender: 'Male',
    joinDate: '2023-08-01',
    managerId: 'USR004',
    isManager: false,
    annualLeaveEntitled: 14,
    annualLeaveTaken: 1,
    sickLeaveEntitled: 14,
    sickLeaveTaken: 1,
    salary: 3800,
    bankAccount: '4455667788 (AmBank)',
    epfNumber: 'EPF445566',
  },
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LR001',
    tenantId: 'TEN001',
    employeeId: 'USR002',
    leaveType: LeaveType.ANNUAL,
    startDate: '2024-08-15',
    endDate: '2024-08-16',
    reason: 'Family vacation.',
    status: RequestStatus.PENDING,
    days: 2,
  },
  {
    id: 'LR002',
    tenantId: 'TEN001',
    employeeId: 'USR003',
    leaveType: LeaveType.SICK,
    startDate: '2024-07-22',
    endDate: '2024-07-22',
    reason: 'Fever and headache.',
    status: RequestStatus.APPROVED,
    days: 1,
  },
  {
    id: 'LR003',
    tenantId: 'TEN001',
    employeeId: 'USR001',
    leaveType: LeaveType.ANNUAL,
    startDate: '2024-09-02',
    endDate: '2024-09-05',
    reason: 'Short trip.',
    status: RequestStatus.APPROVED,
    days: 4,
  },
    {
    id: 'LR004',
    tenantId: 'TEN002',
    employeeId: 'USR006',
    leaveType: LeaveType.EMERGENCY,
    startDate: '2024-07-29',
    endDate: '2024-07-29',
    reason: 'Family emergency, need to travel back to hometown.',
    status: RequestStatus.PENDING,
    days: 1,
  },
];

export const MOCK_CLAIM_REQUESTS: ClaimRequest[] = [
  {
    id: 'CR001',
    tenantId: 'TEN001',
    employeeId: 'USR003',
    claimType: 'Travel',
    amount: 150.50,
    date: '2024-07-18',
    description: 'Client meeting transportation (Grab)',
    attachmentName: 'grab_receipt.pdf',
    status: RequestStatus.APPROVED,
  },
  {
    id: 'CR002',
    tenantId: 'TEN002',
    employeeId: 'USR006',
    claimType: 'Team Lunch',
    amount: 85.00,
    date: '2024-07-20',
    description: 'Team lunch with junior developers',
    attachmentName: 'lunch_receipt.jpg',
    status: RequestStatus.PENDING,
  },
  {
    id: 'CR003',
    tenantId: 'TEN001',
    employeeId: 'USR001',
    claimType: 'Software',
    amount: 250.00,
    date: '2024-06-30',
    description: 'Annual subscription for HR productivity tool.',
    status: RequestStatus.REJECTED,
  },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANN001',
    tenantId: 'TEN001',
    authorId: 'USR001',
    title: 'Upcoming Public Holiday: National Day',
    content: 'Please be advised that the office will be closed on August 31st, 2024, in observance of National Day (Hari Kebangsaan). We encourage everyone to take this time to celebrate with family and friends. Operations will resume as normal on the following business day. Merdeka!',
    createdAt: '2024-08-20T10:00:00Z',
  },
  {
    id: 'ANN002',
    tenantId: 'TEN001',
    authorId: 'USR001',
    title: 'Q3 Town Hall Meeting',
    content: 'Our quarterly Town Hall meeting is scheduled for Friday, September 6th at 3:00 PM in the main conference room. We will be discussing our performance in Q3 and our goals for the final quarter of the year. Your attendance is highly encouraged.',
    createdAt: '2024-08-18T15:30:00Z',
  },
   {
    id: 'ANN003',
    tenantId: 'TEN002',
    authorId: 'USR005',
    title: 'New Marketing Campaign Kick-off',
    content: 'The Marketing department is excited to launch our new "Go Green" campaign next Monday! Please familiarize yourselves with the campaign materials shared via email. Let\'s make this our most successful campaign yet!',
    createdAt: '2024-08-22T11:00:00Z',
  }
];

export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  { id: 'ATT001', tenantId: 'TEN001', employeeId: 'USR002', date: '2024-08-01', status: AttendanceStatus.PRESENT, checkInTime: '08:55 AM' },
  { id: 'ATT002', tenantId: 'TEN001', employeeId: 'USR002', date: '2024-08-02', status: AttendanceStatus.PRESENT, checkInTime: '09:01 AM' },
  { id: 'ATT003', tenantId: 'TEN001', employeeId: 'USR002', date: '2024-08-05', status: AttendanceStatus.LATE, notes: 'Stuck in traffic jam.', checkInTime: '09:15 AM' },
  { id: 'ATT004', tenantId: 'TEN001', employeeId: 'USR002', date: '2024-08-06', status: AttendanceStatus.PRESENT, checkInTime: '08:49 AM' },
  { id: 'ATT005', tenantId: 'TEN001', employeeId: 'USR003', date: '2024-08-01', status: AttendanceStatus.PRESENT, checkInTime: '08:58 AM' },
  { id: 'ATT006', tenantId: 'TEN001', employeeId: 'USR003', date: '2024-07-22', status: AttendanceStatus.ON_LEAVE },
  { id: 'ATT007', tenantId: 'TEN001', employeeId: 'USR003', date: '2024-08-05', status: AttendanceStatus.ABSENT, notes: 'Feeling unwell, no MC yet.' },
  { id: 'ATT008', tenantId: 'TEN002', employeeId: 'USR006', date: '2024-07-29', status: AttendanceStatus.ON_LEAVE },
];

export const MOCK_DISCIPLINE_RECORDS: DisciplineRecord[] = [
  { 
    id: 'DIS001', 
    tenantId: 'TEN001', 
    employeeId: 'USR003', 
    date: '2024-06-15', 
    actionType: DisciplineActionType.VERBAL_WARNING, 
    description: 'Received a verbal warning for missing a project deadline. Discussed importance of time management.',
  },
  // FIX: Completed the discipline record object with a description and corrected the action type.
  { 
    id: 'DIS002', 
    tenantId: 'TEN001', 
    employeeId: 'USR003', 
    date: '2024-08-06', 
    actionType: DisciplineActionType.WRITTEN_WARNING,
    description: 'Received a written warning for repeated absenteeism as per the verbal warning on 2024-06-15.',
  },
];

// FIX: Added missing mock data exports to resolve import errors.
export const MOCK_PERFORMANCE_GOALS: PerformanceGoal[] = [
  {
    id: 'GOAL001',
    tenantId: 'TEN001',
    employeeId: 'USR002',
    title: 'Refactor Authentication Module',
    description: 'Improve security and performance of the user authentication service.',
    metric: 'Reduce login time by 20% and achieve 0 security vulnerabilities in penetration testing.',
    progress: 75,
    status: GoalStatus.ON_TRACK,
    dueDate: '2024-09-30',
  },
  {
    id: 'GOAL002',
    tenantId: 'TEN001',
    employeeId: 'USR003',
    title: 'Increase Q4 Social Media Engagement',
    description: 'Grow our social media presence and engagement across all platforms.',
    metric: 'Increase follower count by 15% and engagement rate by 25%.',
    progress: 40,
    status: GoalStatus.AT_RISK,
    dueDate: '2024-12-31',
  },
  {
    id: 'GOAL003',
    tenantId: 'TEN002',
    employeeId: 'USR006',
    title: 'Complete Frontend Developer Bootcamp',
    description: 'Finish the assigned online training for advanced React concepts.',
    metric: 'Complete all modules and achieve a final score of 90% or higher.',
    progress: 100,
    status: GoalStatus.COMPLETED,
    dueDate: '2024-07-31',
  },
];

export const MOCK_PERFORMANCE_REVIEWS: PerformanceReview[] = [
  {
    id: 'REV001',
    tenantId: 'TEN001',
    employeeId: 'USR002',
    reviewerId: 'USR001',
    reviewPeriod: 'Q2 2024',
    selfAssessment: 'I believe I performed well, especially on the API integration project. I need to improve my documentation skills.',
    managerAssessment: 'Badrul consistently delivers high-quality code. His work on the new API was exceptional. We will work on improving his documentation practices in Q3.',
    rating: 4,
    status: ReviewStatus.COMPLETED,
    reviewDate: '2024-07-15',
  },
  {
    id: 'REV002',
    tenantId: 'TEN001',
    employeeId: 'USR003',
    reviewerId: 'USR001',
    reviewPeriod: 'Q2 2024',
    selfAssessment: 'The social media campaign was a success, but I struggled with the analytics report. I need more training on data analysis tools.',
    managerAssessment: '',
    rating: undefined,
    status: ReviewStatus.PENDING_MANAGER_REVIEW,
    reviewDate: '2024-07-20',
  },
];

export const MOCK_TRAINING_COURSES: TrainingCourse[] = [
  {
    id: 'CRS001',
    tenantId: 'TEN001',
    title: 'Advanced React & TypeScript',
    provider: 'ProDev Academy',
    description: 'Deep dive into advanced React patterns, hooks, state management, and TypeScript integration for large-scale applications.',
    cost: 1500,
    duration: '3 Days',
    isHrdcClaimable: true,
  },
  {
    id: 'CRS002',
    tenantId: 'TEN001',
    title: 'Digital Marketing Analytics',
    provider: 'MarketPro Institute',
    description: 'Learn to track, analyze, and report on marketing campaigns using Google Analytics and other modern tools.',
    cost: 1200,
    duration: '2 Days',
    isHrdcClaimable: true,
  },
   {
    id: 'CRS003',
    tenantId: 'TEN002',
    title: 'Certified AWS Solutions Architect',
    provider: 'CloudGuru',
    description: 'Comprehensive course to prepare for the AWS Solutions Architect - Associate certification exam.',
    cost: 2500,
    duration: '5 Days',
    isHrdcClaimable: false,
  },
];

export const MOCK_TRAINING_REQUESTS: TrainingRequest[] = [
  {
    id: 'TRQ001',
    tenantId: 'TEN001',
    employeeId: 'USR002',
    courseId: 'CRS001',
    status: TrainingStatus.APPROVED,
    requestDate: '2024-08-01',
    reason: 'I want to improve my TypeScript skills to contribute better to our new projects.',
  },
  {
    id: 'TRQ002',
    tenantId: 'TEN001',
    employeeId: 'USR003',
    courseId: 'CRS002',
    status: TrainingStatus.PENDING,
    requestDate: '2024-08-10',
    reason: 'This will help me better measure the impact of my marketing campaigns.',
  },
];

export const MOCK_ASSETS: Asset[] = [
    {
        id: 'ASSET001',
        tenantId: 'TEN001',
        name: 'Dell Latitude 7420',
        category: 'Laptop',
        serialNumber: 'SN-DELL-12345',
        purchaseDate: '2023-01-15',
        status: AssetStatus.ASSIGNED,
        assignedTo: 'USR002',
    },
    {
        id: 'ASSET002',
        tenantId: 'TEN001',
        name: 'iPhone 14',
        category: 'Phone',
        serialNumber: 'SN-IPH-67890',
        purchaseDate: '2023-03-20',
        status: AssetStatus.ASSIGNED,
        assignedTo: 'USR001',
    },
    {
        id: 'ASSET003',
        tenantId: 'TEN001',
        name: 'Logitech MX Master 3',
        category: 'Mouse',
        serialNumber: 'SN-LOGI-11223',
        purchaseDate: '2023-01-15',
        status: AssetStatus.IN_STOCK,
    },
      {
        id: 'ASSET004',
        tenantId: 'TEN002',
        name: 'MacBook Pro 16"',
        category: 'Laptop',
        serialNumber: 'SN-MAC-44556',
        purchaseDate: '2024-02-10',
        status: AssetStatus.ASSIGNED,
        assignedTo: 'USR004',
    },
];

export const MOCK_JOB_POSTINGS: JobPosting[] = [
    {
        id: 'JOB001',
        tenantId: 'TEN001',
        title: 'Senior Frontend Engineer',
        department: 'Technology',
        description: 'Looking for an experienced Frontend Engineer proficient in React, TypeScript, and modern web technologies.',
        status: JobStatus.OPEN,
    },
    {
        id: 'JOB002',
        tenantId: 'TEN001',
        title: 'HR Executive',
        department: 'Human Resources',
        description: 'Seeking a dynamic HR Executive to manage payroll, recruitment, and employee relations.',
        status: JobStatus.CLOSED,
    },
     {
        id: 'JOB003',
        tenantId: 'TEN002',
        title: 'DevOps Engineer',
        department: 'Technology',
        description: 'Responsible for maintaining and improving our CI/CD pipeline and cloud infrastructure.',
        status: JobStatus.OPEN,
    },
];

export const MOCK_CANDIDATES: Candidate[] = [
    {
        id: 'CAND001',
        tenantId: 'TEN001',
        jobPostingId: 'JOB001',
        name: 'Ismail Sabri',
        email: 'ismail.s@example.com',
        phone: '012-1112222',
        resumeUrl: 'resume_ismail.pdf',
        resumeText: `ISMAIL SABRI - Senior Frontend Engineer
        Summary: A highly skilled Frontend Engineer with over 8 years of experience in building scalable and responsive web applications. Proficient in React, TypeScript, and modern JavaScript frameworks.
        Experience:
        - Lead Frontend Engineer, TechForward Inc (2020-Present): Led a team of 5 engineers to develop a new e-commerce platform. Improved performance by 30%.
        - Software Engineer, WebWorks Sdn Bhd (2016-2020): Developed and maintained client-side applications for various clients.
        Skills: React, TypeScript, GraphQL, Next.js, Web Performance, CI/CD.`,
        stage: CandidateStage.INTERVIEW,
        notes: ['Strong portfolio, good communication skills.'],
    },
    {
        id: 'CAND002',
        tenantId: 'TEN001',
        jobPostingId: 'JOB001',
        name: 'Siti Nurhaliza',
        email: 'siti.n@example.com',
        phone: '019-3334444',
        resumeUrl: 'resume_siti.pdf',
        resumeText: `SITI NURHALIZA - Frontend Developer
        Objective: To leverage my 3 years of experience in web development to contribute to a challenging project.
        Education: Bachelor of Computer Science, Universiti Malaya.
        Skills: HTML, CSS, JavaScript, React, Redux, Figma.
        Projects:
        - Personal Portfolio Website (React & Framer Motion)
        - University Capstone Project: Online library system.`,
        stage: CandidateStage.APPLIED,
        notes: [],
    },
     {
        id: 'CAND003',
        tenantId: 'TEN002',
        jobPostingId: 'JOB003',
        name: 'Lee Chong Wei',
        email: 'lcw@example.com',
        phone: '016-5556666',
        resumeUrl: 'resume_lcw.pdf',
        resumeText: `LEE CHONG WEI - DevOps Engineer
        Profile: Experienced DevOps Engineer with a strong background in cloud infrastructure and CI/CD automation. Certified AWS Solutions Architect.
        Expertise: AWS, Docker, Kubernetes, Jenkins, Terraform, Python.
        Work History:
        - Cloud Engineer, Synergy Tech (2019-Present): Managed AWS infrastructure and automated deployment pipelines, reducing deployment time by 50%.
        - System Administrator, DataCorp (2017-2019): Maintained on-premise servers and network infrastructure.`,
        stage: CandidateStage.OFFER,
        notes: ['Excellent technical skills, great fit for the team.'],
    },
];

export const MOCK_PAYROLL_RUNS: PayrollRun[] = [
    {
        id: 'PAY202407',
        tenantId: 'TEN001',
        month: 7,
        year: 2024,
        status: PayrollStatus.FINALIZED,
        records: [
             {
                employeeId: 'USR001',
                grossSalary: 8000, epfEmployee: 880, epfEmployer: 960, socsoEmployee: 24.75, socsoEmployer: 86.65, eisEmployee: 9.9, eisEmployer: 9.9, pcb: 650, totalDeductions: 1564.65, netSalary: 6435.35
            },
            {
                employeeId: 'USR002',
                grossSalary: 7500, epfEmployee: 825, epfEmployer: 900, socsoEmployee: 24.75, socsoEmployer: 86.65, eisEmployee: 9.9, eisEmployer: 9.9, pcb: 550, totalDeductions: 1409.65, netSalary: 6090.35
            },
        ],
        createdAt: '2024-07-25T09:00:00Z',
    },
     {
        id: 'PAY202408',
        tenantId: 'TEN001',
        month: 8,
        year: 2024,
        status: PayrollStatus.DRAFT,
        records: [],
        createdAt: '2024-08-26T10:00:00Z',
    }
];

export const MOCK_SURVEYS: Survey[] = [
    {
        id: 'SURVEY001',
        tenantId: 'TEN001',
        title: 'Q3 Employee Satisfaction Survey',
        description: 'Your feedback is valuable to us. Please take a few minutes to share your thoughts on your experience working here in the third quarter.',
        status: SurveyStatus.ACTIVE,
        createdAt: '2024-09-01T09:00:00Z',
        questions: [
            { id: 'Q1', text: 'On a scale of 1 to 5, how satisfied are you with your work-life balance?', type: SurveyQuestionType.RATING },
            { id: 'Q2', text: 'What is one thing we could do to improve your work environment?', type: SurveyQuestionType.TEXT },
        ],
    },
    {
        id: 'SURVEY002',
        tenantId: 'TEN001',
        title: 'Company Offsite Event Feedback',
        description: 'Thank you for attending our offsite event. Please provide your feedback to help us plan better events in the future.',
        status: SurveyStatus.CLOSED,
        createdAt: '2024-06-15T09:00:00Z',
        questions: [
            { id: 'Q1', text: 'How would you rate the overall event experience (1=Poor, 5=Excellent)?', type: SurveyQuestionType.RATING },
            { id: 'Q2', text: 'What was your favorite part of the event?', type: SurveyQuestionType.TEXT },
            { id: 'Q3', text: 'Do you have any suggestions for our next event location?', type: SurveyQuestionType.TEXT },
        ],
    },
];

export const MOCK_SURVEY_RESPONSES: SurveyResponse[] = [
    {
        id: 'S_RES_001',
        surveyId: 'SURVEY002',
        tenantId: 'TEN001',
        employeeId: 'USR002',
        submittedAt: '2024-06-18T14:00:00Z',
        answers: [
            { questionId: 'Q1', value: 5 },
            { questionId: 'Q2', value: 'The team building activities were really fun and engaging.' },
            { questionId: 'Q3', value: 'Maybe somewhere by the beach next time, like Langkawi.' },
        ]
    },
    {
        id: 'S_RES_002',
        surveyId: 'SURVEY002',
        tenantId: 'TEN001',
        employeeId: 'USR003',
        submittedAt: '2024-06-19T10:00:00Z',
        answers: [
            { questionId: 'Q1', value: 4 },
            { questionId: 'Q2', value: 'The food was excellent.' },
            // FIX: Corrected malformed SurveyAnswer object.
            { questionId: 'Q3', value: 'Maybe a resort in Port Dickson.' },
        ],
    },
];

export const MOCK_ONBOARDING_PROCESSES: OnboardingProcess[] = [
    {
        id: 'ONB001',
        tenantId: 'TEN001',
        employeeId: 'USR007', // New employee Ghazali Razak
        type: OnboardingProcessType.ONBOARDING,
        status: OnboardingProcessStatus.IN_PROGRESS,
        startDate: new Date().toISOString().split('T')[0],
        tasks: [
            { id: 'T01', title: 'Prepare Welcome Kit', description: 'Includes company handbook, swag, and access card.', status: OnboardingTaskStatus.COMPLETED, dueDate: '2024-08-25', assignee: 'HR' },
            { id: 'T02', title: 'Setup IT Equipment', description: 'Laptop, monitor, and necessary software installation.', status: OnboardingTaskStatus.COMPLETED, dueDate: '2024-08-26', assignee: 'IT' },
            { id: 'T03', title: 'Schedule Team Introduction', description: 'Setup a 30-min meeting with the marketing team.', status: OnboardingTaskStatus.TODO, dueDate: '2024-08-27', assignee: 'Manager' },
            { id: 'T04', title: 'First Day Orientation', description: 'Briefing on company culture, policies, and tour.', status: OnboardingTaskStatus.TODO, dueDate: '2024-08-27', assignee: 'HR' },
            { id: 'T05', title: 'Complete HR Paperwork', description: 'Sign employment contract, EPF/SOCSO forms.', status: OnboardingTaskStatus.TODO, dueDate: '2024-08-28', assignee: 'Employee' },
        ]
    },
    {
        id: 'OFF001',
        tenantId: 'TEN001',
        employeeId: 'USR003', // Catherine Tan is leaving
        type: OnboardingProcessType.OFFBOARDING,
        status: OnboardingProcessStatus.COMPLETED, // Changed for analytics calculation
        startDate: '2024-09-15',
        tasks: [
            { id: 'T06', title: 'Conduct Exit Interview', description: 'Schedule and conduct the exit interview to gather feedback.', status: OnboardingTaskStatus.COMPLETED, dueDate: '2024-09-28', assignee: 'HR' },
            { id: 'T07', title: 'Knowledge Transfer Session', description: 'Ensure all project knowledge is transferred to the team.', status: OnboardingTaskStatus.COMPLETED, dueDate: '2024-09-25', assignee: 'Manager' },
            { id: 'T08', title: 'Return Company Assets', description: 'Collect laptop, phone, and access card.', status: OnboardingTaskStatus.COMPLETED, dueDate: '2024-09-30', assignee: 'IT' },
            { id: 'T09', title: 'Final Payroll Calculation', description: 'Calculate final salary, leave encashment, etc.', status: OnboardingTaskStatus.COMPLETED, dueDate: '2024-09-30', assignee: 'HR' },
            { id: 'T10', title: 'Deactivate Accounts', description: 'Revoke access to all company systems and email.', status: OnboardingTaskStatus.COMPLETED, dueDate: '2024-09-30', assignee: 'IT' },
        ]
    }
];

export const MOCK_HEALTH_LOGS: HealthLog[] = [
  { id: 'HL001', tenantId: 'TEN001', employeeId: 'USR001', date: '2024-08-18', stressLevel: 5, workLifeBalance: 7, physicalActivityHours: 3 },
  { id: 'HL002', tenantId: 'TEN001', employeeId: 'USR002', date: '2024-08-18', stressLevel: 7, workLifeBalance: 5, physicalActivityHours: 5 },
  { id: 'HL003', tenantId: 'TEN001', employeeId: 'USR003', date: '2024-08-18', stressLevel: 6, workLifeBalance: 6, physicalActivityHours: 2 },
  { id: 'HL004', tenantId: 'TEN001', employeeId: 'USR001', date: '2024-08-25', stressLevel: 4, workLifeBalance: 8, physicalActivityHours: 4 },
  { id: 'HL005', tenantId: 'TEN001', employeeId: 'USR002', date: '2024-08-25', stressLevel: 6, workLifeBalance: 6, physicalActivityHours: 6 },
];