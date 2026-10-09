import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, X, ShieldAlert, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import api from '../../services/api';

const REPORT_REASONS = [
  { id: 'malicious', label: 'Harmful or Malicious Code', desc: 'Exploits, vulnerabilities, or dangerous commands' },
  { id: 'spam', label: 'Spam or Commercial Promotion', desc: 'Advertisements, repetitive content, or self-promotion' },
  { id: 'harassment', label: 'Inappropriate or Abusive Language', desc: 'Hate speech, toxic comments, or bullying' },
  { id: 'plagiarism', label: 'Plagiarism / IP Violation', desc: 'Stolen or uncredited proprietary code' },
  { id: 'other', label: 'Other Inappropriate Content', desc: 'Violates SyntaxFlow community guidelines' }
];

const ReportModal = ({ isOpen, onClose, snippet }) => {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0].label);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !snippet) return null;

  const handleReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fullReason = additionalDetails.trim() 
      ? `${selectedReason}: ${additionalDetails.trim()}`
      : selectedReason;

    try {
      await api.post(`/api/snippets/${snippet._id}/report`, {
        reason: fullReason
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Report failed:', err);
      const msg = err.response?.data?.msg || err.response?.data?.message || 'Failed to submit report.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20">
              <Flag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Report Inappropriate Post</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Target: "{snippet.title}" by @{snippet.user?.username || snippet.user?.name || 'user'}
              </p>
            </div>
          </div>

          {/* Success State */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center space-y-3"
            >
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">Report Submitted</h4>
              <p className="text-sm text-slate-300 max-w-sm mx-auto">
                Thank you for helping keep SyntaxFlow safe. Our moderation team and admins will review this snippet promptly.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleReport} className="space-y-5">
              {error && (
                <div className="p-3.5 bg-red-950/40 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Reasons List */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Select Reason
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {REPORT_REASONS.map((reason) => {
                    const isSelected = selectedReason === reason.label;
                    return (
                      <div
                        key={reason.id}
                        onClick={() => setSelectedReason(reason.label)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-red-500/10 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-semibold ${isSelected ? 'text-red-300' : 'text-slate-200'}`}>
                            {reason.label}
                          </span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-red-500 bg-red-500' : 'border-slate-600'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{reason.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Context Field */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Additional Details (Optional)
                </label>
                <textarea
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Provide any additional context for the moderators..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
                >
                  {loading ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReportModal;
