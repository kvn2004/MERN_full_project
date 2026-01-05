
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient.ts';

interface CycleEntry {
  _id: string;
  lastPeriodDate: string;
  cycleLength: number;
  periodDuration: number;
}

interface PredictionData {
  nextPeriodDate: string;
  periodEnd: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
}

const History: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<CycleEntry[]>([]);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const fetchData = async () => {
    try {
      const [histRes, predRes] = await Promise.all([
        axiosClient.get('/cycle/my'),
        axiosClient.get('/cycle/prediction').catch(() => ({ data: { data: null } }))
      ]);
      setHistory(histRes.data.data || []);
      setPrediction(predRes.data.data);
    } catch (err) {
      console.error("History fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, month: month - 1, year, current: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month, year, current: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: month + 1, year, current: false });
    }
    return days;
  }, [currentMonth]);

  const getStatus = (day: number, month: number, year: number) => {
    const d = new Date(year, month, day).setHours(0,0,0,0);

    // Past Logs (Logged Periods)
    for (const entry of history) {
      const start = new Date(entry.lastPeriodDate).setHours(0,0,0,0);
      const end = start + (entry.periodDuration - 1) * 86400000;
      if (d >= start && d <= end) return 'period';
    }

    // Predictions
    if (prediction) {
      const nextS = new Date(prediction.nextPeriodDate).setHours(0,0,0,0);
      const nextE = new Date(prediction.periodEnd).setHours(0,0,0,0);
      if (d >= nextS && d <= nextE) return 'expected';

      const ovul = new Date(prediction.ovulationDate).setHours(0,0,0,0);
      if (d === ovul) return 'ovulation';

      const fertS = new Date(prediction.fertileWindowStart).setHours(0,0,0,0);
      const fertE = new Date(prediction.fertileWindowEnd).setHours(0,0,0,0);
      if (d >= fertS && d <= fertE) return 'fertile';
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffcfd]">
        <div className="h-12 w-12 border-4 border-soft-pink border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffcfd] via-[#fff9fa] to-[#fff2f5] pb-20 px-4">
      <header className="max-w-xl mx-auto py-8 flex items-center justify-between">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white rounded-full transition-all text-gray-400 group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:text-soft-pink transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Cycle History</h1>
        <div className="w-10"></div>
      </header>

      <div className="max-w-xl mx-auto space-y-8">
        {/* Glass Calendar */}
        <div className="bg-white/30 backdrop-blur-3xl rounded-[45px] p-8 sm:p-10 shadow-[0_30px_80px_rgba(255,123,165,0.08)] border border-white/60 relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 text-gray-400 hover:text-soft-pink transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </button>
            <h2 className="text-xl font-black text-gray-800 tracking-tight">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 text-gray-400 hover:text-soft-pink transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-3 mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} className="text-[10px] font-black text-gray-300 uppercase text-center tracking-widest">{d}</div>
            ))}
            {calendarDays.map((item, idx) => {
              const status = getStatus(item.day, item.month, item.year);
              const isToday = new Date().setHours(0,0,0,0) === new Date(item.year, item.month, item.day).getTime();
              
              return (
                <div key={idx} className="relative h-12 flex items-center justify-center">
                  {status === 'expected' && <div className="absolute inset-y-1 inset-x-0 bg-pink-100/50 rounded-full border border-pink-200"></div>}
                  {status === 'fertile' && <div className="absolute inset-y-1 inset-x-0 bg-pink-100/20 rounded-full"></div>}
                  {status === 'period' && <div className="absolute inset-y-1 inset-x-0 bg-[#6a6bc4]/20 rounded-full"></div>}
                  
                  <div className={`
                    h-10 w-10 flex items-center justify-center rounded-full text-sm font-bold transition-all relative z-10
                    ${!item.current ? 'text-gray-200' : 'text-gray-800'}
                    ${status === 'ovulation' ? 'bg-[#ff3b30] text-white shadow-lg shadow-red-200' : ''}
                    ${status === 'period' ? 'bg-[#6a6bc4] text-white shadow-lg shadow-indigo-100' : ''}
                    ${isToday && !status ? 'border-2 border-gray-100' : ''}
                  `}>
                    {item.day}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-y-6 sm:flex sm:justify-center sm:space-x-8">
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded-full bg-[#6a6bc4]"></div>
              <span className="text-xs font-semibold text-gray-500">period</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded-full border-2 border-pink-200 bg-white"></div>
              <span className="text-xs font-semibold text-gray-500">expected period</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded-full bg-[#ff3b30]"></div>
              <span className="text-xs font-semibold text-gray-500">ovulation</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded-full bg-pink-100"></div>
              <span className="text-xs font-semibold text-gray-500">fertile</span>
            </div>
          </div>
        </div>

        {/* List of past records */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-4">Cycle Archive</h3>
          {history.map((entry) => (
            <div key={entry._id} className="bg-white/50 backdrop-blur-xl p-6 rounded-[35px] border border-white shadow-sm flex justify-between items-center group hover:-translate-y-1 transition-all">
              <div>
                <p className="font-bold text-gray-800 text-base">
                  {new Date(entry.lastPeriodDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-[10px] font-black text-soft-pink bg-pink-50 px-2 py-0.5 rounded-full uppercase">
                    {entry.periodDuration} Days Flow
                  </span>
                  <span className="text-[10px] font-black text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
                    {entry.cycleLength} Days Cycle
                  </span>
                </div>
              </div>
              <div className="h-10 w-10 bg-gray-50 rounded-2xl flex items-center justify-center text-xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                🌸
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <div className="text-center py-20 bg-white/30 rounded-[45px] border border-dashed border-gray-200">
               <p className="text-gray-400 font-medium">No cycles recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
