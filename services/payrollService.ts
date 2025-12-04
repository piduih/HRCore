
// All rates and tables are based on data for 2024 for Malaysian citizens/PR under 60 years old.

export interface Reliefs {
    lifeInsurance: number;
    lifestyle: number;
    medicalParents: number;
    education: number;
}
/**
 * EPF Contribution Calculation.
 * Rates for salary > RM5000: Employee 11%, Employer 12%.
 * Rates for salary <= RM5000: Employee 11%, Employer 13%.
 * Contribution is based on salary brackets from the Third Schedule of EPF Act 1991.
 * This function uses direct percentage, which is a close approximation. Official calculations may vary slightly.
 * @param monthlySalary Gross monthly salary.
 * @returns EPF contribution details including the new account splits.
 */
export const getEpfContribution = (monthlySalary: number) => {
    if (monthlySalary <= 0) {
        return { employee: 0, employer: 0, akaun1: 0, akaun2: 0, akaun3: 0 };
    }

    const employeeRate = 0.11;
    const employerRate = monthlySalary > 5000 ? 0.12 : 0.13;

    const employeeContribution = monthlySalary * employeeRate;
    const employerContribution = monthlySalary * employerRate;

    // New EPF Account Split (effective May 2024)
    const akaun1 = employeeContribution * 0.75; // Akaun Persaraan
    const akaun2 = employeeContribution * 0.15; // Akaun Sejahtera
    const akaun3 = employeeContribution * 0.10; // Akaun Fleksibel

    return {
        employee: employeeContribution,
        employer: employerContribution,
        akaun1,
        akaun2,
        akaun3,
    };
};

// Data for SOCSO and EIS based on PERKESO's contribution schedule (Jadual Caruman).
// This table represents the salary brackets and their corresponding contribution amounts.
// It covers Category 1 (employees under 60). Capped at a salary of RM5000.
const perkesoSchedule: { maxSalary: number, socsoEmployee: number, socsoEmployer: number, eisEmployee: number, eisEmployer: number }[] = [
    { maxSalary: 30, socsoEmployee: 0.10, socsoEmployer: 0.40, eisEmployee: 0.05, eisEmployer: 0.05 },
    { maxSalary: 50, socsoEmployee: 0.20, socsoEmployer: 0.70, eisEmployee: 0.10, eisEmployer: 0.10 },
    { maxSalary: 70, socsoEmployee: 0.30, socsoEmployer: 1.05, eisEmployee: 0.10, eisEmployer: 0.10 },
    { maxSalary: 100, socsoEmployee: 0.45, socsoEmployer: 1.55, eisEmployee: 0.15, eisEmployer: 0.15 },
    { maxSalary: 140, socsoEmployee: 0.65, socsoEmployer: 2.25, eisEmployee: 0.25, eisEmployer: 0.25 },
    { maxSalary: 200, socsoEmployee: 0.95, socsoEmployer: 3.35, eisEmployee: 0.35, eisEmployer: 0.35 },
    { maxSalary: 300, socsoEmployee: 1.45, socsoEmployer: 5.15, eisEmployee: 0.50, eisEmployer: 0.50 },
    { maxSalary: 400, socsoEmployee: 1.95, socsoEmployer: 6.85, eisEmployee: 0.70, eisEmployer: 0.70 },
    { maxSalary: 500, socsoEmployee: 2.45, socsoEmployer: 8.65, eisEmployee: 0.90, eisEmployer: 0.90 },
    { maxSalary: 600, socsoEmployee: 2.95, socsoEmployer: 10.35, eisEmployee: 1.10, eisEmployer: 1.10 },
    { maxSalary: 700, socsoEmployee: 3.45, socsoEmployer: 12.15, eisEmployee: 1.30, eisEmployer: 1.30 },
    { maxSalary: 800, socsoEmployee: 3.95, socsoEmployer: 13.85, eisEmployee: 1.50, eisEmployer: 1.50 },
    { maxSalary: 900, socsoEmployee: 4.45, socsoEmployer: 15.65, eisEmployee: 1.70, eisEmployer: 1.70 },
    { maxSalary: 1000, socsoEmployee: 4.95, socsoEmployer: 17.35, eisEmployee: 1.90, eisEmployer: 1.90 },
    { maxSalary: 1100, socsoEmployee: 5.45, socsoEmployer: 19.15, eisEmployee: 2.10, eisEmployer: 2.10 },
    { maxSalary: 1200, socsoEmployee: 5.95, socsoEmployer: 20.85, eisEmployee: 2.30, eisEmployer: 2.30 },
    { maxSalary: 1300, socsoEmployee: 6.45, socsoEmployer: 22.65, eisEmployee: 2.50, eisEmployer: 2.50 },
    { maxSalary: 1400, socsoEmployee: 6.95, socsoEmployer: 24.35, eisEmployee: 2.70, eisEmployer: 2.70 },
    { maxSalary: 1500, socsoEmployee: 7.45, socsoEmployer: 26.15, eisEmployee: 2.90, eisEmployer: 2.90 },
    { maxSalary: 1600, socsoEmployee: 7.95, socsoEmployer: 27.85, eisEmployee: 3.10, eisEmployer: 3.10 },
    { maxSalary: 1700, socsoEmployee: 8.45, socsoEmployer: 29.65, eisEmployee: 3.30, eisEmployer: 3.30 },
    { maxSalary: 1800, socsoEmployee: 8.95, socsoEmployer: 31.35, eisEmployee: 3.50, eisEmployer: 3.50 },
    { maxSalary: 1900, socsoEmployee: 9.45, socsoEmployer: 33.15, eisEmployee: 3.70, eisEmployer: 3.70 },
    { maxSalary: 2000, socsoEmployee: 9.95, socsoEmployer: 34.85, eisEmployee: 3.90, eisEmployer: 3.90 },
    { maxSalary: 2100, socsoEmployee: 10.45, socsoEmployer: 36.65, eisEmployee: 4.10, eisEmployer: 4.10 },
    { maxSalary: 2200, socsoEmployee: 10.95, socsoEmployer: 38.35, eisEmployee: 4.30, eisEmployer: 4.30 },
    { maxSalary: 2300, socsoEmployee: 11.45, socsoEmployer: 40.15, eisEmployee: 4.50, eisEmployer: 4.50 },
    { maxSalary: 2400, socsoEmployee: 11.95, socsoEmployer: 41.85, eisEmployee: 4.70, eisEmployer: 4.70 },
    { maxSalary: 2500, socsoEmployee: 12.45, socsoEmployer: 43.65, eisEmployee: 4.90, eisEmployer: 4.90 },
    { maxSalary: 2600, socsoEmployee: 12.95, socsoEmployer: 45.35, eisEmployee: 5.10, eisEmployer: 5.10 },
    { maxSalary: 2700, socsoEmployee: 13.45, socsoEmployer: 47.15, eisEmployee: 5.30, eisEmployer: 5.30 },
    { maxSalary: 2800, socsoEmployee: 13.95, socsoEmployer: 48.85, eisEmployee: 5.50, eisEmployer: 5.50 },
    { maxSalary: 2900, socsoEmployee: 14.45, socsoEmployer: 50.65, eisEmployee: 5.70, eisEmployer: 5.70 },
    { maxSalary: 3000, socsoEmployee: 14.95, socsoEmployer: 52.35, eisEmployee: 5.90, eisEmployer: 5.90 },
    { maxSalary: 3100, socsoEmployee: 15.45, socsoEmployer: 54.15, eisEmployee: 6.10, eisEmployer: 6.10 },
    { maxSalary: 3200, socsoEmployee: 15.95, socsoEmployer: 55.85, eisEmployee: 6.30, eisEmployer: 6.30 },
    { maxSalary: 3300, socsoEmployee: 16.45, socsoEmployer: 57.65, eisEmployee: 6.50, eisEmployer: 6.50 },
    { maxSalary: 3400, socsoEmployee: 16.95, socsoEmployer: 59.35, eisEmployee: 6.70, eisEmployer: 6.70 },
    { maxSalary: 3500, socsoEmployee: 17.45, socsoEmployer: 61.15, eisEmployee: 6.90, eisEmployer: 6.90 },
    { maxSalary: 3600, socsoEmployee: 17.95, socsoEmployer: 62.85, eisEmployee: 7.10, eisEmployer: 7.10 },
    { maxSalary: 3700, socsoEmployee: 18.45, socsoEmployer: 64.65, eisEmployee: 7.30, eisEmployer: 7.30 },
    { maxSalary: 3800, socsoEmployee: 18.95, socsoEmployer: 66.35, eisEmployee: 7.50, eisEmployer: 7.50 },
    { maxSalary: 3900, socsoEmployee: 19.45, socsoEmployer: 68.15, eisEmployee: 7.70, eisEmployer: 7.70 },
    { maxSalary: 4000, socsoEmployee: 19.95, socsoEmployer: 69.85, eisEmployee: 7.90, eisEmployer: 7.90 },
    { maxSalary: 4100, socsoEmployee: 20.45, socsoEmployer: 71.65, eisEmployee: 8.10, eisEmployer: 8.10 },
    { maxSalary: 4200, socsoEmployee: 20.95, socsoEmployer: 73.35, eisEmployee: 8.30, eisEmployer: 8.30 },
    { maxSalary: 4300, socsoEmployee: 21.45, socsoEmployer: 75.15, eisEmployee: 8.50, eisEmployer: 8.50 },
    { maxSalary: 4400, socsoEmployee: 21.95, socsoEmployer: 76.85, eisEmployee: 8.70, eisEmployer: 8.70 },
    { maxSalary: 4500, socsoEmployee: 22.45, socsoEmployer: 78.65, eisEmployee: 8.90, eisEmployer: 8.90 },
    { maxSalary: 4600, socsoEmployee: 22.95, socsoEmployer: 80.35, eisEmployee: 9.10, eisEmployer: 9.10 },
    { maxSalary: 4700, socsoEmployee: 23.45, socsoEmployer: 82.15, eisEmployee: 9.30, eisEmployer: 9.30 },
    { maxSalary: 4800, socsoEmployee: 23.95, socsoEmployer: 83.85, eisEmployee: 9.50, eisEmployer: 9.50 },
    { maxSalary: 4900, socsoEmployee: 24.45, socsoEmployer: 85.65, eisEmployee: 9.70, eisEmployer: 9.70 },
    { maxSalary: 5000, socsoEmployee: 24.95, socsoEmployer: 87.35, eisEmployee: 9.90, eisEmployer: 9.90 },
];

const findContributionBracket = (monthlySalary: number) => {
    if (monthlySalary <= 0) return null;
    const cappedSalary = Math.min(monthlySalary, 5900.01); // Use cap for > RM 5000 salaries.

    if (cappedSalary > 5000) {
        // LHDN uses a slightly different upper bound, so we cap at a higher conceptual value
        // The last bracket is for wages exceeding RM4,900 but not exceeding RM5,000. For calculation it's RM 4950 midpoint.
        // For salary > 5000, we use contribution for RM 5000.
         return { maxSalary: Infinity, socsoEmployee: 24.75, socsoEmployer: 86.65, eisEmployee: 9.90, eisEmployer: 9.90 }
    }
    
    let previousMax = 0;
    for (const bracket of perkesoSchedule) {
        if (monthlySalary > previousMax && monthlySalary <= bracket.maxSalary) {
            return bracket;
        }
        previousMax = bracket.maxSalary;
    }
    return null; // Should not happen for salary > 0
}

export const getSocsoContribution = (monthlySalary: number) => {
    const bracket = findContributionBracket(monthlySalary);
    if (!bracket) return { employee: 0, employer: 0 };
    return { employee: bracket.socsoEmployee, employer: bracket.socsoEmployer };
}

export const getEisContribution = (monthlySalary: number) => {
    const bracket = findContributionBracket(monthlySalary);
    if (!bracket) return { employee: 0, employer: 0 };
    return { employee: bracket.eisEmployee, employer: bracket.eisEmployer };
}


/**
 * PCB (Income Tax) Calculation.
 * Highly simplified for a single individual with only self and EPF reliefs.
 * THIS IS NOT FOR OFFICIAL USE.
 * @param monthlySalary Gross monthly salary.
 * @param epfEmployee Employee's monthly EPF contribution.
 * @returns Estimated monthly PCB.
 */
export const getPcbContribution = (monthlySalary: number, epfEmployee: number, reliefs: Reliefs) => {
    const annualSalary = monthlySalary * 12;
    if (annualSalary <= 34000) return 0; // Below minimum threshold for tax after reliefs

    const annualEpf = epfEmployee * 12;
    
    // Standard reliefs
    const personalRelief = 9000;
    const epfRelief = Math.min(annualEpf, 4000);
    
    // Additional user-provided reliefs with max caps
    const lifeInsuranceRelief = Math.min(reliefs.lifeInsurance, 3000);
    const lifestyleRelief = Math.min(reliefs.lifestyle, 2500);
    const medicalParentRelief = Math.min(reliefs.medicalParents, 8000);
    const educationFeesRelief = Math.min(reliefs.education, 7000);

    const totalReliefs = personalRelief + epfRelief + lifeInsuranceRelief + lifestyleRelief + medicalParentRelief + educationFeesRelief;
    
    const chargeableIncome = Math.max(0, annualSalary - totalReliefs);

    if (chargeableIncome <= 5000) return 0;
    
    let tax = 0;
    // Based on 2024 tax brackets
    if (chargeableIncome > 1000000) tax = 255650 + (chargeableIncome - 1000000) * 0.30;
    else if (chargeableIncome > 600000) tax = 135650 + (chargeableIncome - 600000) * 0.28;
    else if (chargeableIncome > 400000) tax = 81450 + (chargeableIncome - 400000) * 0.26;
    else if (chargeableIncome > 250000) tax = 40450 + (chargeableIncome - 250000) * 0.25;
    else if (chargeableIncome > 100000) tax = 9150 + (chargeableIncome - 100000) * 0.24;
    else if (chargeableIncome > 70000) tax = 3350 + (chargeableIncome - 70000) * 0.21;
    else if (chargeableIncome > 50000) tax = 1550 + (chargeableIncome - 50000) * 0.16;
    else if (chargeableIncome > 35000) tax = 600 + (chargeableIncome - 35000) * 0.08;
    else if (chargeableIncome > 20000) tax = 150 + (chargeableIncome - 20000) * 0.06;
    else if (chargeableIncome > 5000) tax = (chargeableIncome - 5000) * 0.01;
    
    return Math.max(0, tax / 12);
};

// --- Plan C: New Functions ---

export interface RetirementParams {
    currentAge: number;
    retirementAge: number;
    currentSalary: number;
    currentBalance: number;
    salaryIncrement: number; // as percentage
    annualDividend: number; // as percentage
}

export const calculateRetirementProjection = (params: RetirementParams) => {
    let balance = params.currentBalance;
    let salary = params.currentSalary;
    const yearsToSimulate = params.retirementAge - params.currentAge;
    
    const projectionTimeline = [];

    for (let i = 0; i < yearsToSimulate; i++) {
        const annualSalary = salary * 12;
        const epfContribution = getEpfContribution(salary);
        const totalAnnualContribution = (epfContribution.employee + epfContribution.employer) * 12;

        balance += totalAnnualContribution;
        const dividendEarned = balance * (params.annualDividend / 100);
        balance += dividendEarned;

        // Save data point every 5 years or at the end
        if ((i + 1) % 5 === 0 || (i + 1) === yearsToSimulate) {
            projectionTimeline.push({
                age: params.currentAge + i + 1,
                balance: balance,
            });
        }
        
        salary *= (1 + params.salaryIncrement / 100);
    }

    return {
        finalBalance: balance,
        timeline: projectionTimeline,
    };
};


export const calculateEisBenefits = (assumedMonthlyWage: number) => {
    if (assumedMonthlyWage <= 0) return [];
    
    // Capped at RM4950 for Assumed Monthly Wage for calculation purposes
    const cappedWage = Math.min(assumedMonthlyWage, 4950);

    const payoutRates = [0.8, 0.5, 0.4, 0.4, 0.3, 0.3]; // For months 1 to 6

    return payoutRates.map((rate, index) => ({
        month: index + 1,
        amount: cappedWage * rate,
    }));
};
