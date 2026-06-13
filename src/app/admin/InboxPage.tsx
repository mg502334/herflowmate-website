import React, { useState } from "react";
import { Search, Inbox, ShieldAlert, CheckCircle2, MailOpen, Reply, Trash2, Clock, Send } from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext";

type EmailFolder = "support" | "legal" | "resolved";

interface EmailMessage {
  id: string;
  folder: EmailFolder;
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
}

const MOCK_EMAILS: EmailMessage[] = [
  {
    id: "MSG-001",
    folder: "support",
    senderName: "Sarah Jenkins",
    senderEmail: "sarah.j@example.com",
    subject: "Question about my subscription",
    body: "Hi team,\n\nI was wondering if it's possible to skip my upcoming shipment for next month? I still have plenty of pads left over from the last box.\n\nThanks,\nSarah",
    date: "10:42 AM",
    read: false,
  },
  {
    id: "MSG-002",
    folder: "support",
    senderName: "Emily Chen",
    senderEmail: "emily.chen@example.com",
    subject: "Order ORD-1044 missing tracking info",
    body: "Hello HerFlowMate Support,\n\nMy order says it is awaiting shipping but I haven't received a tracking number yet. Can you please check on this for me?\n\nBest,\nEmily",
    date: "Yesterday",
    read: true,
  },
  {
    id: "MSG-003",
    folder: "legal",
    senderName: "Michael Davies",
    senderEmail: "mdavies@lawfirm.com",
    subject: "Trademark Inquiry regarding packaging",
    body: "To whom it may concern,\n\nI am reaching out on behalf of my client to request a copy of your Brand Guidelines package, as we are exploring a potential wholesale partnership and wish to ensure compliance with your trademark usage.\n\nPlease advise.",
    date: "Mon",
    read: false,
  },
  {
    id: "MSG-004",
    folder: "resolved",
    senderName: "Jessica Martinez",
    senderEmail: "jess.martinez@example.com",
    subject: "Loved the Harmony Kit!",
    body: "Just wanted to write in and say I absolutely loved the packaging and care put into my first box. You guys are doing great work!\n\n- Jess",
    date: "Last Week",
    read: true,
  }
];

export function InboxPage() {
  const { session } = useAdminAuth();
  const [activeFolder, setActiveFolder] = useState<EmailFolder>("support");
  const [emails, setEmails] = useState<EmailMessage[]>(MOCK_EMAILS);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");

  const activeEmails = emails.filter(
    (e) => e.folder === activeFolder && 
    (e.subject.toLowerCase().includes(searchQuery.toLowerCase()) || e.senderName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  const handleSelectEmail = (id: string) => {
    setSelectedEmailId(id);
    setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
    setReplyText("");
  };

  const handleResolve = () => {
    if (!selectedEmailId) return;
    setEmails(prev => prev.map(e => e.id === selectedEmailId ? { ...e, folder: "resolved" } : e));
    setSelectedEmailId(null);
  };

  const handleSendReply = () => {
    if (!selectedEmail || !replyText.trim()) return;
    alert(`Simulating sending reply via Resend API to ${selectedEmail.senderEmail}...\n\nMessage: ${replyText}`);
    setReplyText("");
    handleResolve();
  };

  const unreadSupportCount = emails.filter(e => e.folder === "support" && !e.read).length;
  const unreadLegalCount = emails.filter(e => e.folder === "legal" && !e.read).length;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <MailOpen className="w-8 h-8 mr-3 text-[#38BDF8]" />
          Inbox
        </h1>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search messages..."
            className="bg-[#1E293B] border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 bg-[#1E293B] rounded-xl border border-gray-800 overflow-hidden shadow-xl flex">
        {/* Folders Sidebar */}
        <div className="w-64 border-r border-gray-800 flex flex-col bg-[#0F172A]/50">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mailboxes</h3>
          </div>
          <nav className="p-2 space-y-1">
            <button 
              onClick={() => { setActiveFolder("support"); setSelectedEmailId(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeFolder === 'support' ? 'bg-[#38BDF8]/10 text-[#38BDF8]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center">
                <Inbox className="w-4 h-4 mr-3" />
                Support
              </div>
              {unreadSupportCount > 0 && (
                <span className={`text-xs py-0.5 px-2 rounded-full ${activeFolder === 'support' ? 'bg-[#38BDF8]/20 text-[#38BDF8]' : 'bg-[#38BDF8] text-[#0F172A]'}`}>
                  {unreadSupportCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => { setActiveFolder("legal"); setSelectedEmailId(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeFolder === 'legal' ? 'bg-purple-500/10 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center">
                <ShieldAlert className="w-4 h-4 mr-3" />
                Legal
              </div>
              {unreadLegalCount > 0 && (
                <span className={`text-xs py-0.5 px-2 rounded-full ${activeFolder === 'legal' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-500 text-white'}`}>
                  {unreadLegalCount}
                </span>
              )}
            </button>
          </nav>
          
          <div className="p-4 border-t border-b border-gray-800 mt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Archive</h3>
          </div>
          <nav className="p-2 space-y-1 flex-1">
            <button 
              onClick={() => { setActiveFolder("resolved"); setSelectedEmailId(null); }}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeFolder === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <CheckCircle2 className="w-4 h-4 mr-3" />
              Resolved
            </button>
          </nav>
        </div>

        {/* Email List */}
        <div className="w-80 border-r border-gray-800 flex flex-col bg-[#1E293B]">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1E293B] sticky top-0">
            <h2 className="font-semibold text-white capitalize">{activeFolder} Inbox</h2>
            <span className="text-xs text-gray-500">{activeEmails.length} messages</span>
          </div>
          <div className="overflow-y-auto flex-1">
            {activeEmails.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20 text-emerald-500" />
                <p>Inbox zero! Great job.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {activeEmails.map(email => (
                  <div 
                    key={email.id} 
                    onClick={() => handleSelectEmail(email.id)}
                    className={`p-4 cursor-pointer transition-colors ${selectedEmailId === email.id ? 'bg-[#38BDF8]/10 border-l-2 border-[#38BDF8]' : 'hover:bg-white/5 border-l-2 border-transparent'} ${!email.read ? 'bg-[#0F172A]/30' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm truncate pr-2 ${!email.read ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>{email.senderName}</h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{email.date}</span>
                    </div>
                    <p className={`text-xs truncate mb-1 ${!email.read ? 'font-semibold text-gray-200' : 'text-gray-400'}`}>{email.subject}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{email.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reading Pane */}
        <div className="flex-1 flex flex-col bg-[#0F172A]/30 relative">
          {selectedEmail ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-[#1E293B]">
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">{selectedEmail.subject}</h2>
                  <div className="flex items-center text-sm">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38BDF8] to-blue-600 flex items-center justify-center text-white font-bold text-lg mr-3 shadow-lg">
                      {selectedEmail.senderName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{selectedEmail.senderName}</p>
                      <p className="text-gray-400 text-xs">{"<"}{selectedEmail.senderEmail}{">"}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 flex items-center mr-4">
                    <Clock className="w-4 h-4 mr-1.5" /> {selectedEmail.date}
                  </span>
                  {activeFolder !== "resolved" && (
                    <button onClick={handleResolve} className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" title="Mark as Resolved">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => {}} className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Body */}
              <div className="p-8 flex-1 overflow-y-auto">
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-w-3xl">
                  {selectedEmail.body}
                </div>
              </div>

              {/* Reply Box */}
              {activeFolder !== "resolved" && (
                <div className="p-4 border-t border-gray-800 bg-[#1E293B]">
                  <div className="bg-[#0F172A] rounded-xl border border-gray-700 overflow-hidden focus-within:ring-2 focus-within:ring-[#38BDF8] transition-shadow">
                    <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700 text-xs text-gray-400 font-medium flex items-center">
                      <Reply className="w-3 h-3 mr-2" />
                      Replying to {selectedEmail.senderName}
                    </div>
                    <textarea 
                      className="w-full bg-transparent text-white p-4 text-sm focus:outline-none resize-none min-h-[120px]"
                      placeholder="Type your reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>
                    <div className="flex justify-between items-center px-4 py-3 bg-gray-800/30 border-t border-gray-700">
                      <span className="text-xs text-gray-500">Will be sent via Resend API from {activeFolder}@herflowmate.com</span>
                      <button 
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                        className="bg-[#38BDF8] text-[#0F172A] font-bold px-6 py-2 rounded-lg text-sm hover:bg-[#38BDF8]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <Inbox className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
