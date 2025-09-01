
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Subject, Topic, TopicStatus, ProgressLog, SyllabusStats } from '../types';
import { INITIAL_SYLLABUS } from '../constants';

const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
  }
  return defaultValue;
};

export const useSyllabus = () => {
  const [subjects, setSubjects] = useState<Subject[]>(() => getInitialState('syllabus', INITIAL_SYLLABUS));
  const [progressHistory, setProgressHistory] = useState<ProgressLog[]>(() => getInitialState('progressHistory', []));

  useEffect(() => {
    try {
      window.localStorage.setItem('syllabus', JSON.stringify(subjects));
    } catch (error) {
      console.error('Error saving syllabus to localStorage:', error);
    }
  }, [subjects]);

  useEffect(() => {
    try {
      window.localStorage.setItem('progressHistory', JSON.stringify(progressHistory));
    } catch (error) {
      console.error('Error saving progress history to localStorage:', error);
    }
  }, [progressHistory]);

  const updateTopicStatus = useCallback((subjectId: string, topicId: string, newStatus: TopicStatus) => {
    let oldStatus: TopicStatus | null = null;
    
    setSubjects(prevSubjects =>
      prevSubjects.map(subject => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            topics: subject.topics.map(topic => {
              if (topic.id === topicId) {
                oldStatus = topic.status;
                return { ...topic, status: newStatus };
              }
              return topic;
            }),
          };
        }
        return subject;
      })
    );

    if (oldStatus !== newStatus) {
      const today = new Date().toISOString().split('T')[0];
      setProgressHistory(prevHistory => {
        const newHistory = [...prevHistory];
        let todayLog = newHistory.find(log => log.date === today);

        let increment = 0;
        if (newStatus === 'Completed') increment = 1;
        if (oldStatus === 'Completed') increment = -1;
        
        if (increment !== 0) {
            if (todayLog) {
                todayLog.completedCount = Math.max(0, todayLog.completedCount + increment);
            } else if (increment > 0) {
                newHistory.push({ date: today, completedCount: 1 });
            }
        }
        return newHistory.filter(log => log.completedCount >= 0);
      });
    }
  }, []);

  const addSubject = useCallback((name: string, icon: string) => {
    const newSubject: Subject = {
      id: `subject-${Date.now()}`,
      name,
      icon,
      topics: [],
    };
    setSubjects(prevSubjects => [...prevSubjects, newSubject]);
  }, []);
  
  const stats: SyllabusStats = useMemo(() => {
    let totalTopics = 0;
    let completedTopics = 0;
    let inProgressTopics = 0;

    subjects.forEach(subject => {
      totalTopics += subject.topics.length;
      subject.topics.forEach(topic => {
        if (topic.status === 'Completed') {
          completedTopics++;
        } else if (topic.status === 'In Progress') {
          inProgressTopics++;
        }
      });
    });

    const notStartedTopics = totalTopics - completedTopics - inProgressTopics;
    const overallCompletion = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return {
      totalTopics,
      completedTopics,
      inProgressTopics,
      notStartedTopics,
      overallCompletion,
    };
  }, [subjects]);


  return { subjects, updateTopicStatus, addSubject, progressHistory, stats };
};
