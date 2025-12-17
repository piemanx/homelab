import React from 'react';
import { PlayCircle, Music, Film, Tv } from 'lucide-react';

const PlexWidget = ({ data }) => {
  if (!data) return <div className="p-6 bg-surface rounded-2xl animate-pulse h-48 border border-white/5">Loading Plex...</div>;

  const { sessions, recent } = data;
  const isPlaying = sessions && sessions.length > 0;

  const formatTime = (ms) => {
    if (!ms) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getIcon = (type) => {
    if (type === 'track') return Music;
    if (type === 'episode') return Tv;
    return Film;
  };

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-xl border border-white/5 overflow-hidden relative group hover:border-white/10 transition-colors">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500" />
      
      <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
        <PlayCircle className="w-6 h-6 text-orange-500" />
        {isPlaying ? 'Now Playing' : 'Recently Added'}
      </h3>

      <div className="space-y-4">
        {isPlaying ? (
          sessions.map((s) => {
            const Icon = getIcon(s.type);
            const progress = s.duration ? (s.viewOffset / s.duration) * 100 : 0;
            const title = s.title;
            const subtitle = s.type === 'track' 
              ? `${s.grandparentTitle} - ${s.parentTitle}` // Artist - Album
              : s.type === 'episode' 
                ? `${s.grandparentTitle} - S${s.parentIndex}E${s.index}` // Show - S01E01
                : s.year; // Movie Year

            return (
              <div key={s.ratingKey} className="bg-surface-active p-4 rounded-xl border border-white/5">
                 <div className="flex gap-4 mb-3">
                    <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center shrink-0 text-slate-700">
                      <Icon className="w-8 h-8 opacity-50" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 truncate text-lg" title={title}>{title}</div>
                      <div className="text-sm text-brand truncate mb-1">{subtitle}</div>
                      <div className="flex justify-between text-xs text-slate-500">
                         <span>{s.User?.title}</span>
                         <span>{formatTime(s.viewOffset)} / {formatTime(s.duration)}</span>
                      </div>
                    </div>
                 </div>

                 {/* Progress Bar */}
                 <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-orange-500 h-full transition-all duration-1000 ease-linear" 
                      style={{ width: `${progress}%` }}
                    />
                 </div>
              </div>
            );
          })
        ) : (
          recent.map((m) => (
             <div key={m.ratingKey} className="flex gap-4 items-center border-b border-white/5 pb-3 last:border-0 last:pb-0 hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
               <div className="w-10 h-10 bg-surface-active rounded-lg flex items-center justify-center shrink-0 text-slate-700 border border-white/5">
                 <Film className="w-5 h-5 opacity-50" />
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
