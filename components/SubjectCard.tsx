import React, { useState, useMemo } from 'react';
import type { Subject, TopicStatus } from '../types';
import { TopicItem } from './TopicItem';
import { ProgressBar } from './ProgressBar';
import { ChevronDownIcon, iconMap, TargetIcon, PlusIcon } from './icons';

interface SubjectCardProps {
  subject: Subject;
  updateTopicStatus: (subjectId: string, topicId: string, newStatus: TopicStatus) => void;
  addTopic: (subjectId: string, topicName: string) => void;
  deleteTopic: (subjectId: string, topicId: string) => void;
}

const AddTopicModal: React.FC<{ isOpen: boolean; onClose: () => void; onAddTopic: (name: string) => void; }> = ({ isOpen, onClose, onAddTopic }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddTopic(name.trim());
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Add New Topic</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="e.g., Important Amendments"
            required
            autoFocus
          />
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={!name.trim()} className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-500 disabled:cursor-not-allowed">
              Add Topic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, updateTopicStatus, addTopic, deleteTopic }) => {
  const [isOpen, setIsOpen] = useState(subject.topics.length > 0);
  const [isAddTopicModalOpen, setAddTopicModalOpen] = useState(false);

  const subjectProgress = useMemo(() => {
    if (subject.topics.length === 0) return 0;
    const completed = subject.topics.filter(t => t.status === 'Completed').length;
    return Math.round((completed / subject.topics.length) * 100);
  }, [subject.topics]);
  
  const Icon = iconMap[subject.icon] || TargetIcon;

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 flex flex-col">
        <div 
          className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-700/50"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <div className="flex items-center">
            <Icon className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />
            <div className="ml-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{subject.name}</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">{subject.topics.length} Topics</span>
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

        <div className={`transition-all duration-500 ease-in-out overflow-y-auto flex-grow ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
          {subject.topics.length > 0 ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-700 px-2 pb-2">
              {subject.topics.map(topic => (
                <TopicItem 
                  key={topic.id}
                  topic={topic}
                  onStatusChange={(newStatus) => updateTopicStatus(subject.id, topic.id, newStatus)}
                  onDelete={() => deleteTopic(subject.id, topic.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-500">
              <p>No topics added yet.</p>
            </div>
          )}
        </div>
        
        <div className="p-2 border-t border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setAddTopicModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 p-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400 rounded-md hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Add Topic
          </button>
        </div>
      </div>
      <AddTopicModal 
        isOpen={isAddTopicModalOpen} 
        onClose={() => setAddTopicModalOpen(false)} 
        onAddTopic={(name) => addTopic(subject.id, name)} 
      />
    </>
  );
};