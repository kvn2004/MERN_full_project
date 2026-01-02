
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout.tsx';
import Button from '../components/Button.tsx';
import { saveCycleData } from '../redux/authSlice.ts';
import type { AppDispatch, RootState } from '../redux/store.ts';

const SYMPTOMS = [
  { id: 'cramps', label: 'Cramps', icon: '😣' },
  { id: 'mood', label: 'Mood Swings', icon: '🎭' },
  { id: 'headache', label: 'Headache', icon: '🤕' },
  { id: 'cravings', label: 'Cravings', icon: '🍫' },
  { id: 'bloating', label: 'Bloating', icon: '🎈' },
  { id: 'fatigue', label: 'Fatigue', icon: '😴' },
];

const FLOW_LEVELS = [
  { id: 'light', label: 'Light', desc: 'Spotting or minimal flow' },
  { id: 'medium', label: 'Medium', desc: 'Average flow' },
  { id: 'heavy', label: 'Heavy', desc: 'Strong flow' },
];

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    lastPeriodDate: '',
    cycleLength: 28,
    periodDuration: 5,
    symptoms: [] as string[],
    flowLevel: 'medium',
   
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const totalSteps = 5;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleFinish();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSymptomToggle = (id: string) => {
    setData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(id) 
        ? prev.symptoms.filter(s => s !== id) 
        : [...prev.symptoms, id]
    }));
  };

  const handleFinish = async () => {
    const resultAction = await dispatch(saveCycleData(data));
    if (saveCycleData.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800">When did your last period start?</h3>
              <p className="text-sm text-gray-500 mt-2">Pick the date of the first day of bleeding</p>
            </div>
            <input
              type="date"
              className="w-full px-4 py-4 border-2 border-pink-100 rounded-2xl focus:border-soft-pink focus:ring-2 focus:ring-soft-pink outline-none transition-all text-lg text-center"
              value={data.lastPeriodDate}
              onChange={(e) => setData({ ...data, lastPeriodDate: e.target.value })}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800">How long is your cycle?</h3>
              <p className="text-sm text-gray-500 mt-2">Days from the start of one period to the next</p>
            </div>
            <div className="flex items-center justify-center space-x-6">
              <button onClick={() => setData({...data, cycleLength: Math.max(20, data.cycleLength - 1)})} className="h-12 w-12 rounded-full border-2 border-pink-100 text-soft-pink text-2xl font-bold hover:bg-pink-50 transition-colors">-</button>
              <span className="text-5xl font-extrabold text-gray-800">{data.cycleLength}</span>
              <button onClick={() => setData({...data, cycleLength: Math.min(45, data.cycleLength + 1)})} className="h-12 w-12 rounded-full border-2 border-pink-100 text-soft-pink text-2xl font-bold hover:bg-pink-50 transition-colors">+</button>
            </div>
            <p className="text-center text-xs text-gray-400">Not sure? 28 days is the most common.</p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800">How long does it usually last?</h3>
              <p className="text-sm text-gray-500 mt-2">Number of days you usually bleed</p>
            </div>
            <div className="flex items-center justify-center space-x-6">
              <button onClick={() => setData({...data, periodDuration: Math.max(1, data.periodDuration - 1)})} className="h-12 w-12 rounded-full border-2 border-pink-100 text-soft-pink text-2xl font-bold hover:bg-pink-50 transition-colors">-</button>
              <span className="text-5xl font-extrabold text-gray-800">{data.periodDuration}</span>
              <button onClick={() => setData({...data, periodDuration: Math.min(10, data.periodDuration + 1)})} className="h-12 w-12 rounded-full border-2 border-pink-100 text-soft-pink text-2xl font-bold hover:bg-pink-50 transition-colors">+</button>
            </div>
            <p className="text-center text-xs text-gray-400">Typical duration is 3-7 days.</p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800">Any symptoms?</h3>
              <p className="text-sm text-gray-500 mt-2">Select what you've been feeling recently</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SYMPTOMS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSymptomToggle(s.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    data.symptoms.includes(s.id) 
                    ? 'border-soft-pink bg-pink-50 text-soft-pink font-bold shadow-sm' 
                    : 'border-gray-100 hover:border-pink-200 text-gray-600'
                  }`}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800">How is your flow level?</h3>
              <p className="text-sm text-gray-500 mt-2">This helps us track your period intensity</p>
            </div>
            <div className="space-y-3">
              {FLOW_LEVELS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setData({ ...data, flowLevel: f.id })}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                    data.flowLevel === f.id 
                    ? 'border-soft-pink bg-pink-50 shadow-sm' 
                    : 'border-gray-100 hover:border-pink-200'
                  }`}
                >
                  <div className={`h-4 w-4 rounded-full border-2 ${data.flowLevel === f.id ? 'bg-soft-pink border-soft-pink' : 'border-gray-300'}`} />
                  <div>
                    <p className={`font-bold ${data.flowLevel === f.id ? 'text-soft-pink' : 'text-gray-700'}`}>{f.label}</p>
                    <p className="text-xs text-gray-500">{f.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      title="Personalize LunaFlow" 
      subtitle={`Step ${step} of ${totalSteps}`}
    >
      <div className="mb-8">
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-soft-pink transition-all duration-500 ease-out" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}

      {renderStep()}

      <div className="mt-10 flex gap-4">
        {step > 1 && (
          <Button variant="outline" onClick={prevStep} disabled={loading}>
            Back
          </Button>
        )}
        <Button 
          onClick={nextStep} 
          loading={loading}
          disabled={step === 1 && !data.lastPeriodDate}
        >
          {step === totalSteps ? 'Finish Setup' : 'Continue'}
        </Button>
      </div>

      {step > 3 && (
        <button 
          onClick={handleFinish}
          className="w-full mt-4 text-sm text-gray-400 font-medium hover:text-soft-pink transition-colors"
        >
          Skip for now
        </button>
      )}
    </Layout>
  );
};

export default Onboarding;
