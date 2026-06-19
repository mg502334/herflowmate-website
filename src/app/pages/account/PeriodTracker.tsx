import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../lib/supabase';
import { useCustomerAuth } from '../../components/CustomerAuthContext';
import { CalendarHeart, Plus, Save, Clock, Droplets, Info } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, addDays, differenceInDays, parseISO, startOfDay } from 'date-fns';

export function PeriodTracker() {
  const { user } = useCustomerAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Settings
  const [showFertility, setShowFertility] = useState(false);

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('period_logs')
      .select('*')
      .eq('user_id', user?.id)
      .order('start_date', { ascending: false });
      
    if (!error && data) {
      setLogs(data);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    const { error } = await supabase.from('period_logs').insert([
      {
        user_id: user.id,
        start_date: startDate,
        end_date: endDate || null,
        notes: notes || null,
      }
    ]);

    if (!error) {
      setShowAddForm(false);
      setStartDate('');
      setEndDate('');
      setNotes('');
      fetchLogs();
    } else {
      console.error("Supabase Save Error:", error);
    }
    setSaving(false);
  };

  const handleDayClick = (day: Date) => {
    const formatted = format(day, 'yyyy-MM-dd');
    if (!showAddForm) setShowAddForm(true);
    setStartDate(formatted);
  };

  // --- MATH & PREDICTIONS ---
  const stats = useMemo(() => {
    let avgCycle = 28;
    let avgLength = 5;
    
    if (logs.length >= 2) {
      let cycleSum = 0;
      for (let i = 0; i < logs.length - 1; i++) {
        cycleSum += differenceInDays(parseISO(logs[i].start_date), parseISO(logs[i+1].start_date));
      }
      avgCycle = Math.round(cycleSum / (logs.length - 1));
    }
    
    const completedLogs = logs.filter(l => l.end_date);
    if (completedLogs.length > 0) {
      let lengthSum = 0;
      completedLogs.forEach(l => {
        lengthSum += differenceInDays(parseISO(l.end_date), parseISO(l.start_date)) + 1;
      });
      avgLength = Math.round(lengthSum / completedLogs.length);
    }
    
    return { avgCycle, avgLength };
  }, [logs]);

  const predictions = useMemo(() => {
    if (logs.length === 0) return null;
    
    const lastStart = parseISO(logs[0].start_date);
    const nextStart = addDays(lastStart, stats.avgCycle);
    const nextEnd = addDays(nextStart, stats.avgLength - 1);
    
    const ovulation = addDays(nextStart, -14);
    const fertileStart = addDays(ovulation, -5);
    const fertileEnd = ovulation;
    
    return { nextStart, nextEnd, ovulation, fertileStart, fertileEnd };
  }, [logs, stats]);

  // --- CALENDAR MODIFIERS ---
  const modifiers = useMemo(() => {
    const periodDays: Date[] = [];
    
    logs.forEach(log => {
      const start = parseISO(log.start_date);
      const end = log.end_date ? parseISO(log.end_date) : (
        differenceInDays(new Date(), start) > 10 ? addDays(start, stats.avgLength - 1) : new Date()
      );
      
      let curr = startOfDay(start);
      const endD = startOfDay(end);
      while (curr <= endD) {
        periodDays.push(curr);
        curr = addDays(curr, 1);
      }
    });

    const predictedDays: Date[] = [];
    const fertileDays: Date[] = [];
    
    if (predictions) {
      let curr = startOfDay(predictions.nextStart);
      const endD = startOfDay(predictions.nextEnd);
      while (curr <= endD) {
        predictedDays.push(curr);
        curr = addDays(curr, 1);
      }
      
      let fCurr = startOfDay(predictions.fertileStart);
      const fEnd = startOfDay(predictions.fertileEnd);
      while (fCurr <= fEnd) {
        fertileDays.push(fCurr);
        fCurr = addDays(fCurr, 1);
      }
    }
    
    return {
      period: periodDays,
      predicted: predictedDays,
      fertile: showFertility ? fertileDays : [],
    };
  }, [logs, predictions, showFertility, stats]);

  const modifiersStyles = {
    period: { backgroundColor: '#F8C8D1', color: '#2C3E50', fontWeight: 'bold' },
    predicted: { backgroundColor: '#FDF1F3', color: '#F8C8D1', border: '1px dashed #F8C8D1' },
    fertile: { backgroundColor: '#E6E6FA', color: '#6A5ACD', fontWeight: 'bold' } // Soft Lavender
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      {/* Header & Stats Banner */}
      <div className="bg-gradient-to-br from-[#2C3E50] to-[#1a2530] rounded-3xl p-8 shadow-lg text-white border border-[#2C3E50]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Droplets size={28} className="text-[#F8C8D1]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif">The Flow Companion</h1>
              <p className="text-gray-300">Log your flow to unlock smart calendar predictions.</p>
            </div>
          </div>
          
          <div className="flex gap-6 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Cycle Length</div>
              <div className="text-xl font-bold">{logs.length >= 2 ? `${stats.avgCycle} Days` : '---'}</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Period Length</div>
              <div className="text-xl font-bold">{logs.length > 0 ? `${stats.avgLength} Days` : '---'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Calendar (Top) + Form */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Calendar & Toggles */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
            
            <div className="w-full flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#2C3E50] font-serif">Your Calendar</h2>
              {/* Privacy Toggle for Fertility */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <span className="text-sm font-bold text-gray-500 group-hover:text-[#2C3E50] transition-colors">Show Fertility Window</span>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={showFertility}
                    onChange={() => setShowFertility(!showFertility)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${showFertility ? 'bg-[#6A5ACD]' : 'bg-gray-200'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showFertility ? 'translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>

            <style>{`
              .rdp { --rdp-cell-size: 40px; margin: 0; }
              .rdp-day_selected { background-color: transparent !important; }
            `}</style>
            <DayPicker
              mode="single"
              onDayClick={handleDayClick}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="bg-white"
            />

            {/* Legend */}
            <div className="w-full mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <div className="w-3 h-3 rounded-full bg-[#F8C8D1]" /> Logged Period
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <div className="w-3 h-3 rounded-full bg-[#FDF1F3] border border-dashed border-[#F8C8D1]" /> Predicted
              </div>
              {showFertility && (
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <div className="w-3 h-3 rounded-full bg-[#E6E6FA]" /> Fertile Window
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Predictions & Add Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="bg-[#FAFAFA] rounded-3xl p-6 border border-[#F8C8D1]/30">
            <div className="flex items-center gap-3 mb-4 text-[#F8C8D1]">
              <Clock size={20} />
              <h2 className="text-lg font-bold text-[#2C3E50]">Next Period Prediction</h2>
            </div>
            {predictions ? (
              <div>
                <p className="text-3xl font-light text-[#2C3E50] mb-2">
                  {format(predictions.nextStart, 'MMMM do')}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-2 rounded-lg border border-gray-100">
                  <Info size={14} className="text-[#F8C8D1]" />
                  Based on your {stats.avgCycle}-day average cycle.
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Log at least one period to unlock predictions.</p>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#2C3E50] font-serif">Quick Log</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <Plus size={16} className={showAddForm ? 'rotate-45 transition-transform' : 'transition-transform'} />
              </button>
            </div>

            {showAddForm ? (
              <form onSubmit={handleSave} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1.5">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#F8C8D1] focus:ring-2 focus:ring-[#F8C8D1]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1.5">End Date (Optional)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#F8C8D1] focus:ring-2 focus:ring-[#F8C8D1]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1.5">Notes & Symptoms</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Cramps, mood changes, etc."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#F8C8D1] focus:ring-2 focus:ring-[#F8C8D1]/20 outline-none transition-all min-h-[80px]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving || !startDate}
                  className="w-full flex items-center justify-center gap-2 bg-[#F8C8D1] text-[#2C3E50] py-3 rounded-xl font-bold hover:bg-[#f6aab8] transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Log'}
                </button>
              </form>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <CalendarHeart size={32} />
                </div>
                <p className="text-gray-500 text-sm max-w-[200px] mx-auto">
                  Select a date on the calendar or click the plus icon to log a new cycle.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 text-[#F8C8D1] font-bold text-sm hover:underline"
                >
                  Log Period Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Past Cycles List */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-[#2C3E50] mb-6 font-serif">Past Cycles History</h2>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading your history...</div>
          ) : logs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
              You haven't logged any periods yet.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-[#F8C8D1]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FDF1F3] rounded-full flex items-center justify-center text-[#F8C8D1]">
                    <Droplets size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2C3E50]">
                      {format(parseISO(log.start_date), 'MMMM do, yyyy')}
                      {log.end_date && ` — ${format(parseISO(log.end_date), 'MMMM do')}`}
                    </h3>
                    {log.notes && <p className="text-xs text-gray-500 mt-1.5 line-clamp-1">{log.notes}</p>}
                  </div>
                </div>
                <div className="text-xs font-bold text-[#6A5ACD] bg-[#E6E6FA] px-3 py-1.5 rounded-lg w-fit">
                  {log.end_date 
                    ? `${differenceInDays(parseISO(log.end_date), parseISO(log.start_date)) + 1} Days`
                    : 'Ongoing'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
}
