
import type { Subject } from './types';
import { TopicStatus } from './types';

export const INITIAL_SYLLABUS: Subject[] = [
  {
    id: 'reasoning',
    name: 'General Intelligence & Reasoning',
    icon: 'BrainIcon',
    topics: [
      { id: 'r1', name: 'Analogies', status: TopicStatus.NotStarted },
      { id: 'r2', name: 'Classification', status: TopicStatus.NotStarted },
      { id: 'r3', name: 'Series (Verbal and Non-Verbal)', status: TopicStatus.NotStarted },
      { id: 'r4', name: 'Coding-Decoding', status: TopicStatus.NotStarted },
      { id: 'r5', name: 'Syllogism', status: TopicStatus.NotStarted },
      { id: 'r6', name: 'Blood Relations', status: TopicStatus.NotStarted },
      { id: 'r7', name: 'Venn Diagrams', status: TopicStatus.NotStarted },
      { id: 'r8', name: 'Problem Solving', status: TopicStatus.NotStarted },
    ],
  },
  {
    id: 'quant',
    name: 'Quantitative Aptitude',
    icon: 'CalculatorIcon',
    topics: [
      { id: 'q1', name: 'Number Systems', status: TopicStatus.NotStarted },
      { id: 'q2', name: 'Percentages', status: TopicStatus.NotStarted },
      { id: 'q3', name: 'Ratio and Proportion', status: TopicStatus.NotStarted },
      { id: 'q4', name: 'Profit and Loss', status: TopicStatus.NotStarted },
      { id: 'q5', name: 'Time and Work', status: TopicStatus.NotStarted },
      { id: 'q6', name: 'Time, Speed, and Distance', status: TopicStatus.NotStarted },
      { id: 'q7', name: 'Algebra', status: TopicStatus.NotStarted },
      { id: 'q8', name: 'Geometry', status: TopicStatus.NotStarted },
      { id: 'q9', name: 'Trigonometry', status: TopicStatus.NotStarted },
    ],
  },
  {
    id: 'awareness',
    name: 'General Awareness',
    icon: 'BookOpenIcon',
    topics: [
      { id: 'ga1', name: 'History (Ancient, Medieval, Modern)', status: TopicStatus.NotStarted },
      { id: 'ga2', name: 'Geography (Indian and World)', status: TopicStatus.NotStarted },
      { id: 'ga3', name: 'Polity and Constitution', status: TopicStatus.NotStarted },
      { id: 'ga4', name: 'Economics', status: TopicStatus.NotStarted },
      { id: 'ga5', name: 'Static GK (Awards, Books, etc.)', status: TopicStatus.NotStarted },
      { id: 'ga6', name: 'Current Affairs (Last 6 months)', status: TopicStatus.NotStarted },
      { id: 'ga7', name: 'General Science (Physics, Chemistry, Biology)', status: TopicStatus.NotStarted },
    ],
  },
  {
    id: 'english',
    name: 'English Comprehension',
    icon: 'MessageSquareIcon',
    topics: [
      { id: 'e1', name: 'Reading Comprehension', status: TopicStatus.NotStarted },
      { id: 'e2', name: 'Vocabulary (Synonyms, Antonyms, Idioms)', status: TopicStatus.NotStarted },
      { id: 'e3', name: 'Grammar (Error Spotting, Fill in the blanks)', status: TopicStatus.NotStarted },
      { id: 'e4', name: 'Sentence Improvement', status: TopicStatus.NotStarted },
      { id: 'e5', name: 'Active/Passive Voice', status: TopicStatus.NotStarted },
      { id: 'e6', name: 'Direct/Indirect Speech', status: TopicStatus.NotStarted },
      { id: 'e7', name: 'Para Jumbles', status: TopicStatus.NotStarted },
      { id: 'e8', name: 'Cloze Test', status: TopicStatus.NotStarted },
    ],
  },
];
