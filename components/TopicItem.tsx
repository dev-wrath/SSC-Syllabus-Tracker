
import React from 'react';
import { Topic, TopicStatus } from '../types';
import { CheckCircleIcon, ClockIcon, CircleIcon } from './icons';

interface TopicItemProps {
  topic: Topic;
  onStatusChange: (newStatus: TopicStatus) => void;
}

const statusConfig = {
  [TopicStatus.Completed]: {
    icon: CheckCircleIcon,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    next: TopicStatus.NotStarted,
  },
  [TopicStatus.InProgress]: {
    icon: ClockIcon,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    next: TopicStatus.Completed,
  },
  [TopicStatus.NotStarted]: {
    icon: CircleIcon,
    color: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
    next: TopicStatus.InProgress,
  },
};

export const TopicItem: React.FC<TopicItemProps> = ({ topic, onStatusChange }) => {
  const currentStatus = statusConfig[topic.status];
  const Icon = currentStatus.icon;

  const handleStatusChange = () => {
    onStatusChange(currentStatus.next);
  };

  return (
    <div className={`flex items-center justify-between p-3 transition-colors duration-200 rounded-md my-1 ${currentStatus.bgColor}`}>
      <div className="flex items-center">
        <Icon className={`h-5 w-5 mr-3 flex-shrink-0 ${currentStatus.color}`} />
        <span className={`text-slate-300 ${topic.status === TopicStatus.Completed ? 'line-through text-slate-500' : ''}`}>
          {topic.name}
        </span>
      </div>
      <div className="relative">
        <button
          onClick={handleStatusChange}
          className="p-1 rounded-full hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          aria-label={`Change status from ${topic.status}`}
        >
          <span className={`text-xs font-semibold px-2 py-1 rounded-full transition-colors ${currentStatus.color} ${currentStatus.bgColor} border border-current`}>
            {topic.status}
          </span>
        </button>
      </div>
    </div>
  );
};
