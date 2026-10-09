import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Copy, Check, Share2, Code2, ExternalLink, 
  MessageCircle, Send, Globe, Smartphone 
} from 'lucide-react';

const ShareModal = ({ isOpen, onClose, snippet }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen || !snippet) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://syntaxflow.tech';
  const shareUrl = `${currentOrigin}/feed#snippet-${snippet._id}`;
  const snippetTitle = snippet.title || 'Code Snippet';
  const snippetLanguage = snippet.language?.toUpperCase() || 'CODE';
  const authorHandle = snippet.user?.username || snippet.user?.name || 'SyntaxFlow Developer';
  const shareText = `Check out this ${snippetLanguage} snippet "${snippetTitle}" by @${authorHandle} on Syntax|Flow!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyCode = async () => {
    try {
      const codePayload = `// ${snippetTitle} (${snippetLanguage}) by @${authorHandle}\n${snippet.code}`;
      await navigator.clipboard.writeText(codePayload);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${snippetTitle} | Syntax|Flow`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing via navigator.share:', err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const platforms = [
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.668-.699c.969.54 1.761.815 2.79.815 3.18 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.768-5.766-5.768zm0 10.455c-.974 0-1.892-.266-2.695-.741l-.193-.115-1.583.415.422-1.543-.125-.2c-.524-.834-.8-1.802-.8-2.705 0-2.628 2.138-4.767 4.77-4.767 2.631 0 4.77 2.139 4.77 4.767 0 2.628-2.138 4.766-4.769 4.766zm7.969-4.689c-.046-4.409-3.642-7.938-8-7.938-4.418 0-8 3.582-8 8 0 1.411.365 2.775 1.059 3.978l-1.127 4.12 4.234-1.111c1.16.634 2.473.973 3.834.973 4.418 0 8-3.582 8-8 0-.008 0-.015 0-.022z"/>
        </svg>
      ),
      color: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30',
      action: () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    {
      name: 'X (Twitter)',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=coding,syntaxflow,${snippet.language || 'code'}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 0 0 1.63-1.62 1.63 1.63 0 0 0-1.63-1.63 1.63 1.63 0 0 0-1.63 1.63c0 .89.73 1.62 1.63 1.62m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
        </svg>
      ),
      color: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/30',
      action: () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    {
      name: 'Telegram',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      ),
      color: 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border-cyan-500/30',
      action: () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    {
      name: 'Reddit',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm5.748-11.85a1.442 1.442 0 0 0-1.442-1.443 1.43 1.43 0 0 0-.974.385c-1.022-.705-2.417-1.16-3.968-1.218l.676-3.178 2.207.47a1.05 1.05 0 1 0 .216-.684l-2.524-.537a.35.35 0 0 0-.413.267l-.766 3.6c-1.579.043-3.003.498-4.043 1.21a1.434 1.434 0 0 0-.986-.39 1.443 1.443 0 0 0-.96 2.52c-.03.174-.047.352-.047.534 0 2.704 3.14 4.896 7.014 4.896 3.874 0 7.014-2.192 7.014-4.896 0-.177-.016-.35-.045-.52a1.433 1.433 0 0 0 .97-1.416z"/>
        </svg>
      ),
      color: 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border-orange-500/30',
      action: () => {
        const url = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden"
        >
          {/* Aesthetic Background Glows */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 rounded-full transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                Share Snippet
              </h3>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="px-1.5 py-0.5 bg-slate-800 text-cyan-400 rounded border border-slate-700 font-bold">
                  {snippetLanguage}
                </span>
                <span className="truncate max-w-[200px]">"{snippetTitle}"</span>
              </p>
            </div>
          </div>

          {/* Social Platform Grid */}
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3 font-mono">
              Share to Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={platform.action}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all text-xs font-bold ${platform.color} group hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <span className="transition-transform group-hover:scale-110">
                    {platform.icon}
                  </span>
                  <span>{platform.name}</span>
                </button>
              ))}

              {/* Native Device Share Button (if supported) */}
              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  onClick={handleNativeShare}
                  className="flex items-center gap-2.5 p-3 rounded-2xl border bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/30 transition-all text-xs font-bold group hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Smartphone className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>More Apps...</span>
                </button>
              )}
            </div>
          </div>

          {/* Copy Direct Link Section */}
          <div className="space-y-3 mb-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-mono">
              Direct Link
            </label>
            <div className="flex items-center gap-2 bg-slate-950 rounded-2xl p-1.5 border border-slate-800">
              <input 
                type="text" 
                readOnly 
                value={shareUrl}
                className="flex-1 bg-transparent px-3 text-xs text-slate-300 font-mono outline-none select-all truncate"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                  copiedLink 
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Extra utility: Copy Formatted Code */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Need the source code?</span>
            <button 
              onClick={handleCopyCode}
              className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 hover:underline"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5" />}
              {copiedCode ? 'Code Copied!' : 'Copy Raw Code'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShareModal;
