import React, { useState } from 'react';
import { X, FileText, Printer } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

interface ReportPreFlightModalProps {
  onClose: () => void;
  onGenerate: (config: ReportConfig) => void;
}

export interface ReportConfig {
  preparedBy: string;
  preparedFor: string;
  reportStyle: 'landscape' | 'portrait';
  notes: string;
}

export function ReportPreFlightModal({ onClose, onGenerate }: ReportPreFlightModalProps) {
  const { session } = useAdminAuth();
  // Auto-default to the user's email prefix or a generic title
  const defaultAdminName = session?.user?.email?.split('@')[0] || 'Admin';
  
  const [preparedBy, setPreparedBy] = useState(defaultAdminName);
  const [preparedFor, setPreparedFor] = useState('');
  const [reportStyle, setReportStyle] = useState<'landscape' | 'portrait'>('landscape');
  const [notes, setNotes] = useState('');

  const handleGenerate = () => {
    onGenerate({
      preparedBy,
      preparedFor,
      reportStyle,
      notes
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E293B] border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#0F172A]">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#38BDF8]" />
            Report Configuration
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Prepared By</label>
              <input
                type="text"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
                placeholder="e.g. Michelle Garcia - CEO"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Prepared For</label>
              <input
                type="text"
                value={preparedFor}
                onChange={(e) => setPreparedFor(e.target.value)}
                className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
                placeholder="e.g. Board of Directors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Report Layout Style</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setReportStyle('landscape')}
                className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                  reportStyle === 'landscape' 
                    ? 'bg-[#38BDF8]/10 border-[#38BDF8] text-[#38BDF8]' 
                    : 'bg-[#0F172A] border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="w-16 h-10 border-2 border-current rounded mb-2 opacity-80" />
                <span className="font-medium text-sm">Executive Slide Deck</span>
                <span className="text-xs opacity-70 mt-1">(Landscape)</span>
              </button>
              <button
                onClick={() => setReportStyle('portrait')}
                className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                  reportStyle === 'portrait' 
                    ? 'bg-[#38BDF8]/10 border-[#38BDF8] text-[#38BDF8]' 
                    : 'bg-[#0F172A] border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="w-10 h-14 border-2 border-current rounded mb-2 opacity-80" />
                <span className="font-medium text-sm">Traditional Report</span>
                <span className="text-xs opacity-70 mt-1">(Portrait)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Final Page Notes / Summary</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none resize-none"
              placeholder="Enter any closing remarks, bullet points, or executive summaries to be printed on the final slide..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-800 bg-[#0F172A]/50 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="flex items-center px-6 py-2.5 bg-[#38BDF8] text-[#0F172A] rounded-lg font-bold hover:bg-[#38BDF8]/90 transition-all shadow-lg shadow-[#38BDF8]/20"
          >
            <Printer className="w-5 h-5 mr-2" />
            Generate & Print
          </button>
        </div>
      </div>
    </div>
  );
}
