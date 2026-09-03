import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Mail, Sparkles, User, HelpCircle } from 'lucide-react';
import { FeedbackItem } from '../types';

interface FeedbackViewProps {
  feedbackList: FeedbackItem[];
  onSubmitFeedback: (name: string, message: string) => void;
  isOrganizer: boolean;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  feedbackList,
  onSubmitFeedback,
  isOrganizer
}) => {
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [category, setCategory] = useState('Feedback');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusState, setStatusState] = useState<{
    type: 'success' | 'error';
    msg: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setStatusState(null);

    const senderName = name.trim() || 'Volleyball Fan (Krusan)';
    const envObj = (import.meta as unknown as { env?: Record<string, string> }).env;
    const accessKey = envObj?.VITE_WEB3FORMS_ACCESS_KEY || '';

    let deliveredToWeb3Forms = false;

    // Try Web3Forms API submission
    if (accessKey) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `[Krusan Edge 2026] ${category} from ${senderName}`,
            name: senderName,
            contact_info: emailOrPhone.trim() || 'Not provided',
            category: category,
            message: message.trim(),
            from_name: 'Krusan Edge Portal'
          })
        });

        const data = await response.json();
        if (data.success) {
          deliveredToWeb3Forms = true;
        }
      } catch (err) {
        console.warn('Web3Forms dispatch error, falling back to local board:', err);
      }
    }

    // Always record locally so organizers and spectators see it immediately
    onSubmitFeedback(senderName, `[${category}] ${message.trim()}`);

    setIsSubmitting(false);
    setStatusState({
      type: 'success',
      msg: deliveredToWeb3Forms
        ? 'Thank you! Your feedback has been emailed directly to the Krusan Edge Organizing Committee via Web3Forms.'
        : 'Thank you! Your message has been logged to the tournament community board for our organizers to review.'
    });

    setName('');
    setEmailOrPhone('');
    setMessage('');
    setTimeout(() => setStatusState(null), 6000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs font-display mb-1">
          <Mail className="w-4 h-4" />
          <span>Powered by Web3Forms Direct Delivery</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide font-display text-white flex items-center gap-2">
          <span>Tournament Message Board &amp; Feedback</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
          Submit official feedback, referee reviews, fixture queries, or messages of support to the Krusan Edge 2026 Committee.
        </p>
      </div>

      {/* Web3Forms Submission Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        {statusState ? (
          <div
            className={`p-4 rounded-xl border text-sm flex items-start gap-3 ${
              statusState.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <div className="font-bold font-display uppercase tracking-wide text-xs">Submission Confirmed</div>
              <div className="mt-0.5 leading-relaxed">{statusState.msg}</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-display mb-1.5">
                  Your Name / Team (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Captain Showkat / Krusan Supporter"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-display mb-1.5">
                  Email or Phone (Optional)
                </label>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={e => setEmailOrPhone(e.target.value)}
                  placeholder="For organizer callback if needed"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-display mb-1.5">
                Topic / Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50"
              >
                <option value="Match Feedback">Match &amp; Ground Feedback</option>
                <option value="Disciplinary Inquiry">Disciplinary Committee Inquiry</option>
                <option value="Fixture Suggestion">Fixture / Timing Query</option>
                <option value="Fee Settlement">Team Fee Settlement Record</option>
                <option value="Appreciation">Appreciation &amp; Cheer for Teams</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-display mb-1.5">
                Your Message / Suggestion *
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="Write your note, feedback, or suggestion to the committee..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-500">
                Messages are routed securely to organizers via Web3Forms.
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending via Web3Forms...' : 'Submit Message'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Community Message Board */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider font-display">
            Recent Feedback &amp; Public Notices ({feedbackList.length})
          </span>
          {isOrganizer && (
            <span className="text-amber-400 font-medium">Organizer View Active</span>
          )}
        </div>

        {feedbackList.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-500 text-xs">
            No public notes yet. Be the first to leave a message for your team!
          </div>
        ) : (
          <div className="space-y-2.5">
            {feedbackList.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 font-display uppercase tracking-wide">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(item.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed font-normal">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
