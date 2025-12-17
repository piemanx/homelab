import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

const QBitWidget = ({ data }) => {
  if (!data) return <div className="p-6 bg-surface rounded-2xl animate-pulse h-48 border border-white/5">Loading qBittorrent...</div>;
  
  if (data.error) return (
    <div className="bg-surface rounded-2xl p-6 shadow-xl border border-red-500/20 h-48 flex flex-col items-center justify-center text-red-400">
      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/66/QBittorrent_Logo.svg" alt="qBit" className="w-6 h-6 opacity-50"/>
        Connection Failed
      </h3>
      <p className="text-sm text-center opacity-80">Check config or IP ban status.</p>
    </div>
  );

  const formatSpeed = (bytes) => {
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-xl border border-white/5 hover:border-white/10 transition-colors">
      <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/66/QBittorrent_Logo.svg" alt="qBit" className="w-6 h-6"/>
        qBittorrent
      </h3>
      
      <div className="flex gap-4 mb-6 bg-page/50 p-4 rounded-xl border border-white/5">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex items-center text-green-400 mb-1">
            <ArrowDown className="w-4 h-4 mr-1.5" />
            <span className="text-xs uppercase font-bold tracking-wider">Down</span>
          </div>
          <span className="font-mono text-lg font-semibold text-slate-200">{formatSpeed(data.global.dl_info_speed)}</span>
        </div>
        <div className="w-px bg-white/10"></div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex items-center text-blue-400 mb-1">
            <ArrowUp className="w-4 h-4 mr-1.5" />
            <span className="text-xs uppercase font-bold tracking-wider">Up</span>
          </div>
          <span className="font-mono text-lg font-semibold text-slate-200">{formatSpeed(data.global.up_info_speed)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {data.topTorrents.length === 0 ? (
           <p className="text-slate-500 italic text-center py-4">No active torrents</p>
        ) : (
          data.topTorrents.map((t) => (
            <div key={t.hash} className="bg-surface-active p-3 rounded-lg border border-white/5">
              <div className="flex justify-between items-start gap-2 mb-2">
                 <div className="truncate text-slate-200 font-medium text-sm flex-1" title={t.name}>{t.name}</div>
                 <span className="text-xs text-slate-500 whitespace-nowrap">{(t.progress * 100).toFixed(1)}%</span>
              </div>
              
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
                <div 
                  className="bg-brand h-full transition-all duration-500" 
                  style={{ width: `${t.progress * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span className="text-green-500 font-medium">{formatSpeed(t.dlspeed)}</span>
                <span>{t.state}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QBitWidget;
