import React from 'react';
import { PlayCircle, Clock } from 'lucide-react';

const PlexWidget = ({ data }) => {
  if (!data) return <div className="p-6 bg-surface rounded-2xl animate-pulse h-48 border border-white/5">Loading Plex...</div>;

  const { sessions, recent } = data;
  const isPlaying = sessions && sessions.length > 0;

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-xl border border-white/5 overflow-hidden relative group hover:border-white/10 transition-colors">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500" />
      
      <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
        <PlayCircle className="w-6 h-6 text-orange-500" />
        {isPlaying ? 'Now Playing' : 'Recently Added'}
      </h3>

      <div className="space-y-4">
        {isPlaying ? (
          sessions.map((s) => (
            <div key={s.ratingKey} className="flex gap-4 items-center bg-surface-hover/50 p-2 rounded-lg">
               <div className="w-16 h-24 bg-surface-active rounded-md overflow-hidden shrink-0 shadow-md">
                 {/* Images require proxy or direct access with token, skipping for simplicity or using placeholder */}
                 <div className="w-full h-full flex items-center justify-center bg-slate-950 text-xs text-slate-600 font-medium">Poster</div>
               </div>
               <div className="min-w-0">
                 <div className="font-bold text-slate-200 truncate">{s.grandparentTitle || s.title}</div>
                 <div className="text-sm text-slate-400 truncate">{s.grandparentTitle ? `${s.parentTitle} - ${s.title}` : s.year}</div>
                 <div className="text-xs text-brand font-medium mt-2 bg-brand/10 px-2 py-0.5 rounded-full inline-block">User: {s.User?.title}</div>
               </div>
            </div>
          ))
        ) : (
          recent.map((m) => (
             <div key={m.ratingKey} className="flex gap-4 items-center border-b border-white/5 pb-3 last:border-0 last:pb-0 hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
               <div className="w-12 h-16 bg-surface-active rounded overflow-hidden shrink-0 relative shadow-sm">
                 <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                    <span className="text-[10px] text-slate-700">IMG</span>
                 </div>
               </div>
               <div className="min-w-0 flex-1">
                 <div className="font-medium text-slate-200 truncate group-hover:text-white transition-colors">{m.title}</div>
                 <div className="text-xs text-slate-500 mt-0.5">{m.type === 'episode' ? m.grandparentTitle : m.year}</div>
               </div>
             </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlexWidget;
