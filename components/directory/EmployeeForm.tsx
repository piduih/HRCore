
import React, { useState, useEffect } from 'react';
import type { Employee } from '../../types';
import { Button } from '../common/Button';

interface EmployeeFormProps {
  employee: Employee | null;
  onSave: (employee: Omit<Employee, 'id' | 'tenantId'> | Employee) => void;
  onClose: () => void;
}

const initialFormState = {
  name: '',
  position: '',
  department: '',
  email: '',
  phone: '',
  salary: 0,
  avatarUrl: '',
  isManager: false,
  annualLeaveEntitled: 14,
  annualLeaveTaken: 0,
  sickLeaveEntitled: 14,
  sickLeaveTaken: 0,
  gender: 'Male' as 'Male' | 'Female',
  joinDate: new Date().toISOString().split('T')[0],
};

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSave, onClose }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof initialFormState, string>>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
          ...employee,
          // Ensure salary is number
          salary: Number(employee.salary),
          // Ensure numeric values are numbers
          annualLeaveEntitled: Number(employee.annualLeaveEntitled),
          annualLeaveTaken: Number(employee.annualLeaveTaken),
          sickLeaveEntitled: Number(employee.sickLeaveEntitled),
          sickLeaveTaken: Number(employee.sickLeaveTaken),
      });
    } else {
      setFormData(initialFormState);
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof initialFormState, string>> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is not valid';
    if (Number(formData.salary) <= 0) newErrors.salary = 'Salary must be a positive number';
    if (!formData.joinDate) newErrors.joinDate = 'Join date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const dataToSave = {
        ...formData,
        salary: Number(formData.salary),
        annualLeaveEntitled: Number(formData.annualLeaveEntitled),
        annualLeaveTaken: Number(formData.annualLeaveTaken),
        sickLeaveEntitled: Number(formData.sickLeaveEntitled),
        sickLeaveTaken: Number(formData.sickLeaveTaken),
        // Ensure gender is strictly typed
        gender: formData.gender as 'Male' | 'Female',
      };
      onSave(employee ? { ...dataToSave, id: employee.id, tenantId: employee.tenantId } : dataToSave);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Full Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email Address</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
           {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-neutral-700">Position</label>
          <input type="text" name="position" id="position" value={formData.position} onChange={handleChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
        </div>
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-neutral-700">Department</label>
          <input type="text" name="department" id="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
           {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label htmlFor="joinDate" className="block text-sm font-medium text-neutral-700">Join Date</label>
            <input type="date" name="joinDate" id="joinDate" value={formData.joinDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
            {errors.joinDate && <p className="text-red-500 text-xs mt-1">{errors.joinDate}</p>}
        </div>
         <div>
            <label htmlFor="gender" className="block text-sm font-medium text-neutral-700">Gender</label>
            <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
        </div>
      </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">Phone Number</label>
            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-neutral-700">Monthly Salary (RM)</label>
            <input type="number" name="salary" id="salary" value={formData.salary} onChange={handleChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
            {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
          </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         <div>
          <label htmlFor="annualLeaveEntitled" className="block text-sm font-medium text-neutral-700">Annual Leave Entitled</label>
          <input type="number" name="annualLeaveEntitled" id="annualLeaveEntitled" value={formData.annualLeaveEntitled} onChange={handleChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
        </div>
         <div>
          <label htmlFor="sickLeaveEntitled" className="block text-sm font-medium text-neutral-700">Sick Leave Entitled</label>
          <input type="number" name="sickLeaveEntitled" id="sickLeaveEntitled" value={formData.sickLeaveEntitled} onChange={handleChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
        </div>
      </div>
      <div className="flex items-start">
        <div className="flex items-center h-5">
            <input id="isManager" name="isManager" type="checkbox" checked={formData.isManager} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-neutral-300 rounded" />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor="isManager" className="font-medium text-neutral-700">Managerial Role</label>
            <p className="text-neutral-500">Enable this if the employee has managerial responsibilities.</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};
