

import React, { useState, useEffect } from 'react';
import { useAppState, useAppActions } from '../../hooks/useAppContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

const InfoRow: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        <p className="text-neutral-800">{value || '-'}</p>
    </div>
);

export const MyProfile: React.FC = () => {
    const { currentUser } = useAppState();
    const { updateEmployee } = useAppActions();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        phone: currentUser.phone || '',
        bankAccount: currentUser.bankAccount || '',
    });

    useEffect(() => {
        setFormData({
            phone: currentUser.phone || '',
            bankAccount: currentUser.bankAccount || '',
        });
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateEmployee({
            ...currentUser,
            phone: formData.phone,
            bankAccount: formData.bankAccount,
        });
        setIsEditing(false);
    };

    return (
        <div>
            <h3 className="text-lg font-bold text-neutral-800 mb-4">My Personal Information</h3>
            <Card className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InfoRow label="Full Name" value={currentUser.name} />
                    <InfoRow label="Position" value={currentUser.position} />
                    <InfoRow label="Department" value={currentUser.department} />
                    <InfoRow label="Email" value={currentUser.email} />
                    
                    {isEditing ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Bank Account</label>
                                <input
                                    type="text"
                                    name="bankAccount"
                                    value={formData.bankAccount}
                                    onChange={handleChange}
                                    placeholder="e.g., 1234567890 (Maybank)"
                                    className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <InfoRow label="Phone Number" value={currentUser.phone} />
                            <InfoRow label="Bank Account" value={currentUser.bankAccount} />
                        </>
                    )}

                    <InfoRow label="EPF Number" value={currentUser.epfNumber} />
                </div>
                <div className="mt-6 pt-6 border-t border-neutral-200 flex justify-end gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    )}
                </div>
            </Card>
        </div>
    );
};
