
import React, { useState, useMemo } from 'react';
import type { Subject, TopicStatus } from '../types';
import { TopicItem } from './TopicItem';
import { ProgressBar } from './ProgressBar';
import { ChevronDownIcon, iconMap, TargetIcon } from './icons';

interface SubjectCardProps {
  subject: Subject;
  updateTopicStatus: (subjectId: string, topicId: string, newStatus: TopicStatus) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, updateTopicStatus }) => {
  const [isOpen, setIsOpen] = useState(subject.topics.length > 0);

  const subjectProgress = useMemo(() => {
    const completed = subject.topics.filter(t => t.status === 'Completed').length;
    return subject.topics.length > 0 ? Math.round((completed / subject.topics.length) * 100) : 0;
  }, [subject.topics]);
  
  const Icon = iconMap[subject.icon] || TargetIcon;

  return (
    <div className="bg-slate-800 rounded-lg shadow-md border border-slate-700 overflow-hidden transition-all duration-300">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-700/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Icon className="h-8 w-8 text-cyan-400" />
          <div className="ml-4">
            <h3 className="text-xl font-bold text-slate-100">{subject.name}</h3>
            <span className="text-sm text-slate-400">{subject.topics.length} Topics</span>
          </div>
        </div>
        <div className="flex items-center">
            <span className="text-lg font-semibold mr-4">{subjectProgress}%</span>
            <ChevronDownIcon className={`h-6 w-6 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      <div className={`px-4 pb-2 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'}`}>
        <ProgressBar percentage={subjectProgress} />
      </div>

      <div className={`transition-all duration-500 ease-in-out overflow-y-auto ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
        {subject.topics.length > 0 ? (
          <div className="divide-y divide-slate-700 px-2 pb-2">
            {subject.topics.map(topic => (
              <TopicItem 
                key={topic.id}
                topic={topic}
                onStatusChange={(newStatus) => updateTopicStatus(subject.id, topic.id, newStatus)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>No topics added yet.</p>
            <p className="text-sm">You can add topics to this subject later.</p>
          </div>
        )}
      </div>
    </div>
  );
};
