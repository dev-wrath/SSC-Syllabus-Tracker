import React from 'react';
import { Topic, TopicStatus } from '../types';
import { CheckCircleIcon, ClockIcon, CircleIcon, TrashIcon } from './icons';

interface TopicItemProps {
  topic: Topic;
  onStatusChange: (newStatus: TopicStatus) => void;
  onDelete: () => void;
}

const statusConfig = {
  [TopicStatus.Completed]: {
    icon: CheckCircleIcon,
    color: 'text-green-600 dark:text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-500/10',
    next: TopicStatus.NotStarted,
  },
  [TopicStatus.InProgress]: {
    icon: ClockIcon,
    color: 'text-yellow-600 dark:text-yellow-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-500/10',
    next: TopicStatus.Completed,
  },
  [TopicStatus.NotStarted]: {
    icon: CircleIcon,
    color: 'text-slate-500 dark:text-slate-500',
    bgColor: 'bg-slate-100 dark:bg-slate-500/10',
    next: TopicStatus.InProgress,
  },
};

export const TopicItem: React.FC<TopicItemProps> = ({ topic, onStatusChange, onDelete }) => {
  const currentStatus = statusConfig[topic.status];
  const Icon = currentStatus.icon;

  const handleStatusChange = () => {
    onStatusChange(currentStatus.next);
  };

  return (
    <div className={`flex items-center justify-between p-3 transition-colors duration-200 rounded-md my-1 group ${currentStatus.bgColor}`}>
      <div className="flex items-center overflow-hidden">
        <button
          onClick={handleStatusChange}
          className="flex items-center flex-grow min-w-0"
          aria-label={`Change status from ${topic.status}`}
        >
          <Icon className={`h-5 w-5 mr-3 flex-shrink-0 ${currentStatus.color}`} />
          <span className={`text-slate-700 dark:text-slate-300 truncate ${topic.status === TopicStatus.Completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
            {topic.name}
          </span>
        </button>
      </div>
      <div className="flex items-center pl-2">
         <button
          onClick={handleStatusChange}
          className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800"
          aria-label={`Current status: ${topic.status}. Click to change.`}
        >
          <span className={`text-xs font-semibold px-2 py-1 rounded-full transition-colors ${currentStatus.color} ${currentStatus.bgColor} border border-current`}>
            {topic.status}
          </span>
        </button>
        <button
          onClick={onDelete}
          className="ml-2 p-1 rounded-full text-slate-400 dark:text-slate-500 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label={`Delete topic: ${topic.name}`}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};