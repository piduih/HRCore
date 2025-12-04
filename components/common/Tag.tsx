
import React from 'react';

interface TagProps {
  status: string;
}

export const Tag: React.FC<TagProps> = ({ status }) => {
  const statusStyles: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    Completed: 'bg-blue-100 text-blue-800',
  };

  const style = statusStyles[status] || 'bg-neutral-100 text-neutral-800';

  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full inline-block ${style}`}>
      {status}
    </span>
  );
};
