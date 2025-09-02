
export enum TopicStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface Topic {
  id: string;
  name: string;
  status: TopicStatus;
}

export interface Subject {
  id: string;
  name: string;
  icon: string; // Changed to string key for iconMap
  topics: Topic[];
}

export interface ProgressLog {
  date: string; // YYYY-MM-DD
  completedCount: number;
}

export interface SyllabusStats {
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  notStartedTopics: number;
  overallCompletion: number;
}

export interface User {
  name: string;
  email: string;
}
