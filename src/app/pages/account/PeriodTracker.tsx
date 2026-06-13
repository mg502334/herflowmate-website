import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useCustomerAuth } from '../../components/CustomerAuthContext';
import { CalendarHeart, Plus, Save, Clock, Droplets } from 'lucide-react';

export function PeriodTracker() {
  const { user } = useCustomerAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  const calculateNextPeriod = () => {
    if (logs.length < 2) return null;
    
    const lastPeriod = new Date(logs[0].start_date);
    const previousPeriod = new Date(logs[1].start_date);
    
    const diffTime = Math.abs(lastPeriod.getTime() - previousPeriod.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const nextPeriod = new Date(lastPeriod.getTime() + (diffDays * 24 * 60 * 60 * 1000));
    return nextPeriod.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
  };

  const nextPrediction = calculateNextPeriod();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-[#2C3E50] to-[#1a2530] rounded-3xl p-8 shadow-lg text-white border border-[#2C3E50]">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Droplets size={28} className="text-[#F8C8D1]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">The Flow Companion</h1>
            <p className="text-gray-300">Log your flow to get smarter predictions.</p>
          </div>
        </div>
        
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2 text-[#F8C8D1]">
            <Clock size={20} />
            <h2 className="text-lg font-bold">Next Flow Prediction</h2>
          </div>
          <p className="text-3xl font-light">
            {nextPrediction ? nextPrediction : 'Keep logging to unlock predictions'}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-bold text-[#2C3E50]">Past Cycles</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-[#F8C8D1] text-[#2C3E50] px-4 py-2 rounded-full font-bold hover:bg-[#f6aab8] transition-colors shadow-sm cursor-pointer"
        >
          {showAddForm ? 'Cancel' : <><Plus size={18} /> Log Period</>}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-[#F8C8D1]/30 p-6 space-y-4 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#F8C8D1] focus:ring-2 focus:ring-[#F8C8D1]/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">End Date (Optional)</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#F8C8D1] focus:ring-2 focus:ring-[#F8C8D1]/20 outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">Notes & Symptoms</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cramps, mood changes, etc."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#F8C8D1] focus:ring-2 focus:ring-[#F8C8D1]/20 outline-none transition-all min-h-[100px]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#2C3E50] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#1a2530] transition-colors disabled:opacity-70 cursor-pointer"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Log'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading your history...</div>
        ) : logs.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            You haven't logged any periods yet. Click "Log Period" to get started.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FDF1F3] rounded-full flex items-center justify-center text-[#F8C8D1]">
                  <CalendarHeart size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[#2C3E50] text-lg">
                    {new Date(log.start_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    {log.end_date && ` - ${new Date(log.end_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}`}
                  </h3>
                  {log.notes && <p className="text-sm text-[#2C3E50]/70 mt-1">{log.notes}</p>}
                </div>
              </div>
              <div className="text-sm font-semibold text-[#F8C8D1] bg-[#FDF1F3] px-3 py-1 rounded-full w-fit">
                {log.end_date 
                  ? `${Math.ceil((new Date(log.end_date).getTime() - new Date(log.start_date).getTime()) / (1000 * 60 * 60 * 24))} Days`
                  : 'Ongoing'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
