/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, saveCycleData } from '../redux/authSlice.ts';
import axiosClient from '../api/axiosClient.ts';
import Button from '../components/Button.tsx';
import type { AppDispatch, RootState } from '../redux/store.ts';

interface PredictionData {
  lastRecordedPeriod: string;
  averageCycleLength: number;
  nextPeriodDate: string;
  periodEnd: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  isIrregular: boolean;
  note: string;
  pregnancyChance: number;
  pregnancyChanceLabel: string;
}

const SYMPTOMS = [
  { id: 'cramps', label: 'Cramps', icon: '😣' },
  { id: 'mood', label: 'Mood', icon: '🎭' },
  { id: 'headache', label: 'Headache', icon: '🤕' },
  { id: 'bloating', label: 'Bloating', icon: '🎈' },
];

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [entryForm, setEntryForm] = useState({
    lastPeriodDate: new Date().toISOString().split('T')[0],
    cycleLength: 28,
    periodDuration: 5,
    flowLevel: 'medium',
    symptoms: [] as string[]
  });
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: 'user' | 'ai'; text: string }[]
  >([
    {
      role: 'ai',
      text: 'Hi 👋 I’m your CareHer assistant. Ask me about your cycle, fertility, or health tips.',
    },
  ]);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatLoading(true);

    try {
      const res = await axiosClient.post('/chat/ask', {
        message: userMessage,
        context: {
          cycle: data,
        },
      });

      setMessages(prev => [
        ...prev,
        { role: 'ai', text: res.data.reply },
      ]);
    } catch (err) {
      // console.log("ai chat error "+err);
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: 'Sorry 😔 I couldn’t answer right now.' },
      ]);
      
      
    } finally {
      setChatLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axiosClient.get('/cycle/prediction');
      setData(response.data.data);
    } catch (err) {
      console.error("Failed to fetch cycle data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleSymptom = (id: string) => {
    setEntryForm(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(id)
        ? prev.symptoms.filter(s => s !== id)
        : [...prev.symptoms, id]
    }));
  };

  const handleAddEntry = async () => {
    const result = await dispatch(saveCycleData(entryForm));
    if (saveCycleData.fulfilled.match(result)) {
      setShowModal(false);
      fetchDashboardData();
    }
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getCycleProgress = () => {
    if (!data) return 0;
    const start = new Date(data.lastRecordedPeriod).getTime();
    const end = new Date(data.nextPeriodDate).getTime();
    const now = new Date().getTime();
    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9fa]">
        <div className="animate-bounce h-8 w-8 bg-soft-pink rounded-full"></div>
      </div>
    );
  }

  const daysLeft = data ? getDaysRemaining(data.nextPeriodDate) : 0;
  const progress = getCycleProgress();

  return (
    <div className="min-h-screen bg-[#fff9fa] text-gray-800">
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-soft-pink rounded-full flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">CareHer</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/history')}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-soft-pink transition-colors bg-white rounded-full shadow-sm border border-pink-50"
          >
            History
          </button>
          <button
            onClick={() => dispatch(logout())}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-soft-pink transition-colors bg-white rounded-full shadow-sm border border-pink-50"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-10 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Hello, {user?.name?.split(' ')[0]} ✨</h1>
          <p className="text-gray-500 mt-2">{data?.note || 'Your cycle is being tracked.'}</p>
        </div>

        {/* Central Hexagon Period Highlight */}
        <div className="relative flex justify-center items-center mb-24">
          <div className="relative group cursor-default">
            <div
              className="w-64 h-64 bg-white shadow-2xl flex flex-col items-center justify-center relative transition-transform duration-500 group-hover:scale-105 z-10"
              style={{
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                border: '4px solid #fff'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent opacity-50"></div>
              <p className="text-xs font-bold text-soft-pink uppercase tracking-widest mb-1">Period In</p>
              <span className="text-6xl font-black text-gray-900 leading-none">{daysLeft}</span>
              <p className="text-sm font-semibold text-gray-400 mt-1 uppercase">Days</p>
            </div>
            <div className="absolute -inset-4 bg-soft-pink opacity-10 rounded-full animate-pulse z-0"></div>
            <div className="absolute -inset-8 bg-soft-pink opacity-5 rounded-full animate-ping z-0"></div>
          </div>

          <div className="absolute top-0 right-0 sm:right-10 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-pink-100 shadow-sm max-w-[150px] z-20">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Cycle Length</p>
            <p className="text-lg font-bold text-gray-800">{data?.averageCycleLength} Days</p>
          </div>

          <div className="absolute top-0 left-0 sm:left-10 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-pink-100 shadow-sm min-w-[140px] z-20 transition-all hover:-translate-y-1">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Conception Chance</p>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black text-soft-pink">{data?.pregnancyChance ?? 0}%</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${data?.pregnancyChanceLabel === 'High' ? 'bg-red-50 text-red-500' :
                data?.pregnancyChanceLabel === 'Medium' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'
                }`}>
                {data?.pregnancyChanceLabel || 'Low'}
              </span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 sm:left-10 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-pink-100 shadow-sm max-w-[150px] z-20">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Ovulation</p>
            <p className="text-lg font-bold text-gray-800">
              {data ? new Date(data.ovulationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '--'}
            </p>
          </div>
        </div>

        {/* Milestone Journey Timeline */}
        <div className="bg-white rounded-[40px] p-10 shadow-xl border border-pink-50 relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-bold text-gray-800">Your Journey</h2>
            <span className="text-xs font-bold px-3 py-1 bg-pink-50 text-soft-pink rounded-full">Phase: {progress > 50 ? 'Luteal' : 'Follicular'}</span>
          </div>

          <div className="relative pt-10 pb-16 px-4">
            <div className="absolute h-1.5 w-full bg-gray-100 rounded-full top-1/2 -translate-y-1/2 left-0"></div>
            <div
              className="absolute h-1.5 bg-gradient-to-r from-pink-200 to-soft-pink rounded-full top-1/2 -translate-y-1/2 left-0 transition-all duration-1000 ease-in-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-soft-pink rounded-full shadow-md"></div>
            </div>

            <div className="relative flex justify-between items-center">
              <div className="flex flex-col items-center -translate-y-6">
                <div className="w-3 h-3 bg-white border-2 border-gray-300 rounded-full mb-3 z-10"></div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Started</p>
                <p className="text-xs font-semibold text-gray-700">
                  {data ? new Date(data.lastRecordedPeriod).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : ''}
                </p>
              </div>

              <div className="flex flex-col items-center -translate-y-6">
                <div className={`w-4 h-4 rounded-full mb-3 z-10 transition-colors ${progress > 40 ? 'bg-soft-pink shadow-[0_0_10px_rgba(255,123,165,0.5)]' : 'bg-white border-2 border-gray-200'}`}></div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Fertile</p>
                <div className="h-6 w-px bg-gray-200 my-1"></div>
                <p className="text-xs font-semibold text-gray-700">
                  {data ? `${new Date(data.fertileWindowStart).getDate()} - ${new Date(data.fertileWindowEnd).getDate()}` : ''}
                </p>
              </div>

              <div className="flex flex-col items-center -translate-y-6">
                <div className={`w-5 h-5 rounded-full mb-3 z-10 transition-colors flex items-center justify-center ${progress > 95 ? 'bg-soft-pink' : 'bg-white border-2 border-soft-pink'}`}>
                  <div className="w-1.5 h-1.5 bg-soft-pink rounded-full"></div>
                </div>
                <p className="text-[10px] font-bold text-soft-pink uppercase">Goal</p>
                <p className="text-xs font-bold text-gray-900">
                  {data ? new Date(data.nextPeriodDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-pink-900/40 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl relative z-10 flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Form Section */}
            <div className="flex-1 p-8 border-r border-gray-50 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-gray-900">Update Cycle Data</h3>
                <button onClick={() => setShowModal(false)} className="md:hidden h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">✕</button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Last Period Start Date *</label>
                    <input type="date" value={entryForm.lastPeriodDate} onChange={(e) => setEntryForm({ ...entryForm, lastPeriodDate: e.target.value })} className="w-full px-4 py-3 border-2 border-pink-50 rounded-2xl focus:border-soft-pink outline-none transition-all" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Cycle Length *</label>
                      <div className="flex items-center space-x-3 bg-pink-50/30 p-1 rounded-2xl">
                        <button onClick={() => setEntryForm({ ...entryForm, cycleLength: Math.max(20, entryForm.cycleLength - 1) })} className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-soft-pink">-</button>
                        <span className="flex-1 text-center font-black text-gray-800">{entryForm.cycleLength}</span>
                        <button onClick={() => setEntryForm({ ...entryForm, cycleLength: Math.min(45, entryForm.cycleLength + 1) })} className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-soft-pink">+</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Duration *</label>
                      <div className="flex items-center space-x-3 bg-pink-50/30 p-1 rounded-2xl">
                        <button onClick={() => setEntryForm({ ...entryForm, periodDuration: Math.max(1, entryForm.periodDuration - 1) })} className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-soft-pink">-</button>
                        <span className="flex-1 text-center font-black text-gray-800">{entryForm.periodDuration}</span>
                        <button onClick={() => setEntryForm({ ...entryForm, periodDuration: Math.min(10, entryForm.periodDuration + 1) })} className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-soft-pink">+</button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Flow Intensity</label>
                    <div className="flex gap-2">
                      {['Light', 'Medium', 'Heavy'].map((f) => (
                        <button key={f} onClick={() => setEntryForm({ ...entryForm, flowLevel: f.toLowerCase() })} className={`flex-1 py-3 rounded-2xl border-2 transition-all font-bold text-sm ${entryForm.flowLevel === f.toLowerCase() ? 'border-soft-pink bg-pink-50 text-soft-pink shadow-sm' : 'border-gray-50 text-gray-400 bg-white'}`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Symptoms</label>
                    <div className="grid grid-cols-4 gap-2">
                      {SYMPTOMS.map((s) => (
                        <button key={s.id} onClick={() => handleToggleSymptom(s.id)} className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${entryForm.symptoms.includes(s.id) ? 'border-soft-pink bg-pink-50' : 'border-gray-50 bg-white opacity-60'}`}>
                          <span className="text-xl mb-1">{s.icon}</span>
                          <span className="text-[10px] font-bold">{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleAddEntry}>Save All Changes</Button>
                </div>
              </div>
            </div>

            {/* Visual Preview Section */}
            <div className="hidden md:flex flex-col w-[400px] bg-pink-50/30 p-10 justify-center">
              <div className="text-center mb-8">
                <h4 className="text-lg font-black text-gray-800">Visual Preview</h4>
                <p className="text-sm text-gray-500">Immediate look at your next cycle</p>
              </div>

              <div className="bg-white p-6 rounded-[35px] shadow-sm border border-pink-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-gray-800">Next Predicted</span>
                  <span className="text-xs font-bold text-soft-pink bg-pink-50 px-2 py-1 rounded-full">
                    {entryForm.lastPeriodDate ? new Date(new Date(entryForm.lastPeriodDate).getTime() + entryForm.cycleLength * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '--'}
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-[8px] font-bold text-gray-400 text-center mb-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 opacity-40">
                  {Array.from({ length: 31 }).map((_, i) => (
                    <div key={i} className={`h-8 w-full flex items-center justify-center rounded-lg ${i >= 12 && i < 12 + entryForm.periodDuration ? 'bg-soft-pink/20 border border-soft-pink/30' : 'bg-gray-50'}`}>
                      <span className="text-[10px]">{i + 1}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Period Duration</span>
                    <span className="font-bold">{entryForm.periodDuration} Days</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Flow Level</span>
                    <span className="font-bold capitalize">{entryForm.flowLevel}</span>
                  </div>
                </div>
              </div>

              <button onClick={() => setShowModal(false)} className="mt-10 text-xs font-bold text-gray-400 hover:text-soft-pink transition-colors">
                Cancel and close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setShowModal(true)}
          className="bg-soft-pink text-white px-8 py-4 rounded-full shadow-xl shadow-pink-200 font-bold flex items-center space-x-2 hover:bg-[#ff6293] transition-all transform hover:-translate-y-1 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Log Cycle Data</span>
        </button>
      </div>
      {/* AI Chat Assistant */}
      <div className="fixed bottom-6 right-6 z-[999]">
        {showChat && (
          <div className="w-80 h-[420px] bg-white rounded-3xl shadow-2xl border border-pink-100 flex flex-col overflow-hidden mb-3">
            <div className="px-4 py-3 bg-soft-pink text-white font-bold flex justify-between items-center">
              <span>CareHer AI 🌸</span>
              <button onClick={() => setShowChat(false)}>✕</button>
            </div>

            <div className="flex-1 p-3 space-y-2 overflow-y-auto text-sm">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-2xl max-w-[85%] ${m.role === 'user'
                      ? 'bg-soft-pink text-white ml-auto'
                      : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {m.text}
                </div>
              ))}
              {chatLoading && (
                <div className="text-xs text-gray-400">AI is typing...</div>
              )}
            </div>

            <div className="p-3 border-t flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about fertility, periods..."
                className="flex-1 px-3 py-2 text-sm border rounded-full outline-none focus:border-soft-pink"
              />
              <button
                onClick={sendMessage}
                className="px-4 bg-soft-pink text-white rounded-full font-bold"
              >
                Send
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowChat(!showChat)}
          className="h-14 w-14 rounded-full bg-soft-pink text-white shadow-xl flex items-center justify-center text-2xl hover:scale-105 transition"
        >
          💬
        </button>
      </div>

    </div>
  );
};

export default Dashboard;
