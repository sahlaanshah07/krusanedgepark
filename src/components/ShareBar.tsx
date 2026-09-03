import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface ShareBarProps {
  appUrl: string;
  nextMatchText?: string;
}

export const ShareBar: React.FC<ShareBarProps> = ({ appUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.createElement('input');
      input.value = appUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Krusan Edge Tournament 2026',
          text: 'Official Krusan Edge Volleyball Championship 2026 - Live Fixtures, Points Table, and Daily Match Bulletins.',
          url: appUrl
        });
        return;
      } catch (err) {
        // Fallback to copy if user cancels or fails
        if ((err as Error).name !== 'AbortError') {
          handleCopy();
        }
        return;
      }
    }
    // If Web Share API is not supported, fallback to copy
    handleCopy();
  };

  return (
    <div className="bg-slate-900/95 border-y border-amber-500/30 backdrop-blur-md px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 text-slate-300 text-center sm:text-left">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-medium text-slate-200">
            Official Krusan Edge 2026 Portal · Live Daily Match Schedule &amp; Results
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            title="Copy portal link to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Portal Link'}</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            title="Share tournament page"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
