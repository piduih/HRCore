

import React, { useState, useEffect } from 'react';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export const CompanyProfileSettings: React.FC = () => {
    const { companyProfile } = useAppState();
    const { updateCompanyProfile } = useAppActions();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(companyProfile);

    useEffect(() => {
        setFormData(companyProfile);
    }, [companyProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateCompanyProfile(formData);
        setIsEditing(false);
    };

    const FormField: React.FC<{ name: keyof typeof formData, label: string, isTextarea?: boolean }> = ({ name, label, isTextarea }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-neutral-700">{label}</label>
            {isEditing ? (
                isTextarea ? (
                    <textarea
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                ) : (
                    <input
                        type="text"
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                )
            ) : (
                <p className="mt-1 p-2 bg-neutral-100 rounded-md min-h-[42px] whitespace-pre-wrap">{formData[name]}</p>
            )}
        </div>
    );

    return (
        <div>
            <h3 className="text-lg font-bold text-neutral-800 mb-4">Company Information</h3>
            <Card className="p-6">
                <div className="space-y-4">
                    <FormField name="companyName" label="Company Name" />
                    <FormField name="registrationNumber" label="Company Registration No." />
                    <FormField name="address" label="Address" isTextarea />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField name="companyPhone" label="Company Phone" />
                        <FormField name="companyEmail" label="Company Email" />
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-200 flex justify-end gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>Edit Company Details</Button>
                    )}
                </div>
            </Card>
        </div>
    );
};
