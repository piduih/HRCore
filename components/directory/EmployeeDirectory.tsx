
import React, { useState } from 'react';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { EmployeeForm } from './EmployeeForm';
import { PayslipModal } from './PayslipModal';
import type { Employee } from '../../types';
import { EmployeeSnapshotModal } from './EmployeeSnapshotModal';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';

export const EmployeeDirectory: React.FC = () => {
  const { employees } = useAppState();
  const { addEmployee, updateEmployee, deleteEmployee } = useAppActions();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [selectedEmployeeForPayslip, setSelectedEmployeeForPayslip] = useState<Employee | null>(null);
  const [isSnapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [selectedEmployeeForSnapshot, setSelectedEmployeeForSnapshot] = useState<Employee | null>(null);


  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingEmployee(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormModalOpen(true);
  };

  const handleDelete = (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      deleteEmployee(employeeId);
    }
  };
  
  const handleViewPayslip = (employee: Employee) => {
    setSelectedEmployeeForPayslip(employee);
    setIsPayslipModalOpen(true);
  };

  const handleViewSnapshot = (employee: Employee) => {
    setSelectedEmployeeForSnapshot(employee);
    setSnapshotModalOpen(true);
  };

  const handleSave = (employeeData: Omit<Employee, 'id' | 'tenantId'> | Employee) => {
    if ('id' in employeeData && employeeData.id) {
      updateEmployee(employeeData as Employee);
    } else {
      addEmployee(employeeData as Omit<Employee, 'id' | 'tenantId'>);
    }
    setIsFormModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Employee Directory</h2>
          <p className="text-neutral-500">Find and manage contact information for colleagues.</p>
        </div>
        <Button onClick={handleAddNew}>Add New Employee</Button>
      </div>
      
      <div className="max-w-md">
          <input
            type="text"
            placeholder="Search by name, position, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
          />
      </div>

      <Card>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-neutral-500">
                <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Employee</th>
                        <th scope="col" className="px-6 py-3">Position</th>
                        <th scope="col" className="px-6 py-3">Department</th>
                        <th scope="col" className="px-6 py-3">Contact</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map(employee => (
                        <tr key={employee.id} className="bg-white border-b hover:bg-neutral-50">
                            <td className="px-6 py-4 font-medium text-neutral-900">
                                <div className="flex items-center space-x-3">
                                    <img
                                        className="w-10 h-10 rounded-full object-cover"
                                        src={employee.avatarUrl}
                                        alt={employee.name}
                                    />
                                    <span>{employee.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">{employee.position}</td>
                            <td className="px-6 py-4">{employee.department}</td>
                            <td className="px-6 py-4">
                                <div className="truncate">{employee.email}</div>
                                <div className="text-neutral-400">{employee.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-1">
                                    <button onClick={() => handleViewSnapshot(employee)} className="p-2 text-neutral-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors" aria-label={`View snapshot for ${employee.name}`}>
                                        <Icon name="user-circle" className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleViewPayslip(employee)} className="p-2 text-neutral-500 hover:text-green-600 rounded-full hover:bg-green-50 transition-colors" aria-label={`View payslip for ${employee.name}`}>
                                        <Icon name="money-bill" className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleEdit(employee)} className="p-2 text-neutral-500 hover:text-primary rounded-full hover:bg-primary-50 transition-colors" aria-label={`Edit ${employee.name}`}>
                                        <Icon name="edit" className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(employee.id)} className="p-2 text-neutral-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors" aria-label={`Delete ${employee.name}`}>
                                        <Icon name="trash" className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>

      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        size="lg"
      >
        <EmployeeForm 
          employee={editingEmployee}
          onSave={handleSave}
          onClose={() => setIsFormModalOpen(false)}
        />
      </Modal>

      <PayslipModal
        isOpen={isPayslipModalOpen}
        onClose={() => setIsPayslipModalOpen(false)}
        employee={selectedEmployeeForPayslip}
      />

      <EmployeeSnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setSnapshotModalOpen(false)}
        employee={selectedEmployeeForSnapshot}
      />
    </div>
  );
};
