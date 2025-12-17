import React from 'react';
import { PlayCircle, Clock } from 'lucide-react';

const PlexWidget = ({ data }) => {
  if (!data) return <div className="p-6 bg-slate-800 rounded-xl animate-pulse h-48">Loading Plex...</div>;

  const { sessions, recent } = data;
  const isPlaying = sessions && sessions.length > 0;

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500" />
      
      <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
        <PlayCircle className="w-6 h-6 text-orange-500" />
        {isPlaying ? 'Now Playing' : 'Recently Added'}
      </h3>

      <div className="space-y-4">
        {isPlaying ? (
          sessions.map((s) => (
            <div key={s.ratingKey} className="flex gap-4 items-center">
               <div className="w-16 h-24 bg-slate-700 rounded overflow-hidden shrink-0">
                 {/* Images require proxy or direct access with token, skipping for simplicity or using placeholder */}
                 <div className="w-full h-full flex items-center justify-center bg-slate-900 text-xs text-slate-600">Poster</div>
               </div>
               <div>
                 <div className="font-bold text-slate-200">{s.grandparentTitle || s.title}</div>
                 <div className="text-sm text-slate-400">{s.grandparentTitle ? `${s.parentTitle} - ${s.title}` : s.year}</div>
                 <div className="text-xs text-slate-500 mt-1">User: {s.User?.title}</div>
               </div>
            </div>
          ))
        ) : (
          recent.map((m) => (
             <div key={m.ratingKey} className="flex gap-3 items-center border-b border-slate-700/50 pb-2 last:border-0 last:pb-0">
               <div className="w-12 h-16 bg-slate-700 rounded overflow-hidden shrink-0 relative">
                 <div className="w-full h-full bg-slate-900" />
               </div>
               <div className="min-w-0">
                 <div className="font-medium text-slate-300 truncate">{m.title}</div>
                 <div className="text-xs text-slate-500">{m.type === 'episode' ? m.grandparentTitle : m.year}</div>
               </div>
             </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlexWidget;
