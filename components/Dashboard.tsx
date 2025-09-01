
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ProgressLog, SyllabusStats } from '../types';
import { ProgressBar } from './ProgressBar';

interface DashboardProps {
  progressHistory: ProgressLog[];
  stats: SyllabusStats;
}

type Period = 'daily' | 'weekly' | 'monthly';

const processChartData = (history: ProgressLog[], period: Period) => {
    const dataMap = new Map<string, number>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (period === 'daily') {
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const label = date.toLocaleDateString('en-US', { weekday: 'short' });
            dataMap.set(label, 0);
        }
        history.forEach(log => {
            const logDate = new Date(log.date);
            logDate.setHours(0,0,0,0);
            if(logDate.getTime() > today.getTime() - 7 * 24 * 60 * 60 * 1000) {
                 const label = logDate.toLocaleDateString('en-US', { weekday: 'short' });
                 dataMap.set(label, (dataMap.get(label) || 0) + log.completedCount);
            }
        });
    } else if (period === 'weekly') {
        const weekLabels: string[] = [];
        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay() - (i * 7));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            const label = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            weekLabels.push(label);
            dataMap.set(label, 0);
        }
        history.forEach(log => {
            const logDate = new Date(log.date);
            for(let i = 3; i >=0; i--) {
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay() - (i * 7));
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 7);

                if (logDate >= weekStart && logDate < weekEnd) {
                    const label = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                    dataMap.set(label, (dataMap.get(label) || 0) + log.completedCount);
                    break;
                }
            }
        });
    } else if (period === 'monthly') {
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            dataMap.set(label, 0);
        }
        history.forEach(log => {
             const logDate = new Date(log.date);
             const label = logDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
             if(dataMap.has(label)) {
                dataMap.set(label, (dataMap.get(label) || 0) + log.completedCount);
             }
        });
    }

    return Array.from(dataMap.entries()).map(([name, topics]) => ({ name, topics }));
};


export const Dashboard: React.FC<DashboardProps> = ({ progressHistory, stats }) => {
  const [period, setPeriod] = useState<Period>('daily');

  const chartData = useMemo(() => processChartData(progressHistory, period), [progressHistory, period]);

  const StatCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className={`bg-slate-800 p-4 rounded-lg flex flex-col items-center justify-center border-l-4 ${color}`}>
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-sm text-slate-400">{label}</span>
    </div>
  );
  
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-700">
      <h2 className="text-2xl font-bold mb-4 text-slate-100">Progress Dashboard</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Overall Completion</span>
          <span className="font-bold text-cyan-400">{stats.overallCompletion}%</span>
        </div>
        <ProgressBar percentage={stats.overallCompletion} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Completed" value={stats.completedTopics} color="border-green-500" />
        <StatCard label="In Progress" value={stats.inProgressTopics} color="border-yellow-500" />
        <StatCard label="Not Started" value={stats.notStartedTopics} color="border-red-500" />
        <StatCard label="Total Topics" value={stats.totalTopics} color="border-slate-500" />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Topics Completed</h3>
            <div className="flex space-x-1 bg-slate-700 p-1 rounded-lg">
                {(['daily', 'weekly', 'monthly'] as Period[]).map(p => (
                    <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1 text-sm rounded-md capitalize transition-colors ${period === p ? 'bg-cyan-500 text-white' : 'text-slate-300 hover:bg-slate-600'}`}>
                        {p}
                    </button>
                ))}
            </div>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#cbd5e1' }}
              />
              <Legend wrapperStyle={{fontSize: "14px"}} />
              <Bar dataKey="topics" name="Topics Completed" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
