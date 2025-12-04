
import React from 'react';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentProps<typeof Icon>['name'];
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <Card className="p-5">
        <div className="flex items-center">
            <div className="flex-shrink-0">
                 <div className="bg-primary-100 rounded-md p-3">
                    <Icon name={icon} className="h-6 w-6 text-primary" />
                </div>
            </div>
            <div className="ml-5 w-0 flex-1">
                <dl>
                    <dt className="text-sm font-medium text-neutral-500 truncate">{title}</dt>
                    <dd className="text-2xl font-bold text-neutral-900">{value}</dd>
                </dl>
            </div>
        </div>
    </Card>
  );
};
