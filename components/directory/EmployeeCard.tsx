
import React from 'react';
import type { Employee } from '../../types';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  onViewPayslip: (employee: Employee) => void;
  onViewSnapshot: (employee: Employee) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onEdit, onDelete, onViewPayslip, onViewSnapshot }) => {
  return (
    <Card className="flex flex-col text-center p-6 transition-transform transform hover:scale-105 hover:shadow-lg">
      <div className="flex-grow">
        <img
          className="w-24 h-24 mx-auto rounded-full mb-4"
          src={employee.avatarUrl}
          alt={employee.name}
        />
        <h3 className="text-lg font-semibold text-neutral-900">{employee.name}</h3>
        <p className="text-primary">{employee.position}</p>
        <p className="text-sm text-neutral-500 mt-1">{employee.department}</p>
        <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2 text-sm">
          <p className="text-neutral-600 truncate">{employee.email}</p>
          <p className="text-neutral-600">{employee.phone}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-center space-x-2">
        <button onClick={() => onViewSnapshot(employee)} className="p-2 text-neutral-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors" aria-label={`View snapshot for ${employee.name}`}>
          <Icon name="user-circle" className="w-5 h-5" />
        </button>
        <button onClick={() => onViewPayslip(employee)} className="p-2 text-neutral-500 hover:text-green-600 rounded-full hover:bg-green-50 transition-colors" aria-label={`View payslip for ${employee.name}`}>
          <Icon name="money-bill" className="w-5 h-5" />
        </button>
        <button onClick={() => onEdit(employee)} className="p-2 text-neutral-500 hover:text-primary rounded-full hover:bg-primary-50 transition-colors" aria-label={`Edit ${employee.name}`}>
          <Icon name="edit" className="w-5 h-5" />
        </button>
        <button onClick={() => onDelete(employee.id)} className="p-2 text-neutral-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors" aria-label={`Delete ${employee.name}`}>
          <Icon name="trash" className="w-5 h-5" />
        </button>
      </div>
    </Card>
  );
};
