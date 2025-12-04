

import React, { useMemo } from 'react';
import type { Employee } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { getEpfContribution, getSocsoContribution, getEisContribution, getPcbContribution } from '../../services/payrollService';
import { useAppState } from '../../hooks/useAppContext';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const PayslipRow: React.FC<{ label: string; value: string; isBold?: boolean; className?: string }> = ({ label, value, isBold, className }) => (
    <div className={`flex justify-between items-center ${className}`}>
        <span className={isBold ? 'font-semibold' : ''}>{label}</span>
        <span className={isBold ? 'font-semibold' : ''}>{value}</span>
    </div>
);

export const PayslipModal: React.FC<PayslipModalProps> = ({ isOpen, onClose, employee }) => {
  const { tenants, currentTenantId } = useAppState();
  const currentTenant = tenants.find(t => t.id === currentTenantId);

  const calculation = useMemo(() => {
    if (!employee || !employee.salary) return null;

    const salary = employee.salary;
    const epf = getEpfContribution(salary);
    const socso = getSocsoContribution(salary);
    const eis = getEisContribution(salary);
    // Note: PCB calculation here is a basic estimate without individual reliefs
    const pcb = getPcbContribution(salary, epf.employee, { lifeInsurance: 0, lifestyle: 0, medicalParents: 0, education: 0 });

    const totalDeductions = epf.employee + socso.employee + eis.employee + pcb;
    const netSalary = salary - totalDeductions;

    return { salary, epf, socso, eis, pcb, totalDeductions, netSalary };
  }, [employee]);

  if (!isOpen || !employee || !calculation) return null;

  const formatCurrency = (value: number) => `RM ${value.toFixed(2)}`;

  const handlePrint = () => {
    window.print();
  };

  const today = new Date();
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  const payDate = today.toLocaleDateString('en-GB');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Payslip for ${month} ${year}`} size="lg">
      <div id="payslip-content">
        <style>
          {`
            @media print {
              .no-print {
                display: none !important;
              }
              body * {
                visibility: hidden;
              }
              #payslip-content, #payslip-content * {
                visibility: visible;
              }
              #payslip-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                padding: 1rem;
              }
            }
          `}
        </style>
        <div className="text-sm text-neutral-800 p-6 border border-neutral-200 rounded-lg">
          <header className="text-center mb-6">
            <h2 className="text-xl font-bold">{currentTenant?.name}</h2>
            <p className="text-lg font-semibold">Payslip for {month} {year}</p>
          </header>
          
          <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b">
            <div>
                <p><strong>Employee:</strong> {employee.name}</p>
                <p><strong>Position:</strong> {employee.position}</p>
            </div>
            <div>
                <p><strong>Date:</strong> {payDate}</p>
                <p><strong>Employee ID:</strong> {employee.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-base mb-2">Earnings</h3>
              <PayslipRow label="Basic Salary" value={formatCurrency(calculation.salary)} />
            </div>
            <div>
              <h3 className="font-bold text-base mb-2">Deductions</h3>
              <PayslipRow label="EPF" value={formatCurrency(calculation.epf.employee)} />
              <PayslipRow label="SOCSO" value={formatCurrency(calculation.socso.employee)} />
              <PayslipRow label="EIS" value={formatCurrency(calculation.eis.employee)} />
              <PayslipRow label="PCB (Income Tax)" value={formatCurrency(calculation.pcb)} />
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t-2 border-neutral-800 grid grid-cols-2 gap-8">
            <div>
                <PayslipRow label="Gross Pay" value={formatCurrency(calculation.salary)} isBold />
            </div>
            <div>
                <PayslipRow label="Total Deductions" value={formatCurrency(calculation.totalDeductions)} isBold />
            </div>
          </div>

          <div className="mt-4 bg-neutral-100 p-4 rounded-lg text-center">
            <p className="font-bold text-lg">NET PAY</p>
            <p className="font-extrabold text-2xl">{formatCurrency(calculation.netSalary)}</p>
          </div>

          <footer className="mt-6 pt-4 border-t text-xs text-neutral-500">
            <p>This is a computer-generated document. No signature is required.</p>
          </footer>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-2 no-print">
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button onClick={handlePrint}>Print Payslip</Button>
      </div>
    </Modal>
  );
};
