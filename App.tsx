import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SubjectCard } from './components/SubjectCard';
import { useSyllabus } from './hooks/useSyllabus';
import { AddSubjectModal } from './components/AddSubjectModal';
import { PlusIcon } from './components/icons';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { user, ...authProps } = useAuth();
  const { 
    subjects, 
    updateTopicStatus, 
    progressHistory,
    stats,
    addSubject,
    addTopic,
    deleteTopic,
  } = useSyllabus(user);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const handleAddSubject = (name: string, icon: string) => {
    addSubject(name, icon);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300">
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        {...authProps}
      />
      <main className="container mx-auto p-4 md:p-8">
        <Dashboard progressHistory={progressHistory} stats={stats} />

        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 border-l-4 border-cyan-500 dark:border-cyan-400 pl-4">
              Syllabus Breakdown
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900"
              aria-label="Add new subject"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Subject</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subjects.map(subject => (
              <SubjectCard 
                key={subject.id} 
                subject={subject} 
                updateTopicStatus={updateTopicStatus}
                addTopic={addTopic}
                deleteTopic={deleteTopic}
              />
            ))}
          </div>
        </div>
      </main>
      
      <AddSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSubject={handleAddSubject}
      />
    </div>
  );
};

export default App;