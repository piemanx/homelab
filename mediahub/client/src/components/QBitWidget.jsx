import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

const QBitWidget = ({ data }) => {
  if (!data) return <div className="p-6 bg-slate-800 rounded-xl animate-pulse h-48">Loading qBittorrent...</div>;

  const formatSpeed = (bytes) => {
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/66/QBittorrent_Logo.svg" alt="qBit" className="w-6 h-6"/>
        qBittorrent
      </h3>
      
      <div className="flex gap-6 mb-6">
        <div className="flex items-center text-green-400">
          <ArrowDown className="w-5 h-5 mr-1" />
          <span className="font-mono text-lg">{formatSpeed(data.global.dl_info_speed)}</span>
        </div>
        <div className="flex items-center text-blue-400">
          <ArrowUp className="w-5 h-5 mr-1" />
          <span className="font-mono text-lg">{formatSpeed(data.global.up_info_speed)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {data.topTorrents.length === 0 ? (
           <p className="text-slate-500 italic">No active torrents</p>
        ) : (
          data.topTorrents.map((t) => (
            <div key={t.hash} className="bg-slate-900/50 p-3 rounded text-sm">
              <div className="truncate text-slate-300 font-medium mb-1" title={t.name}>{t.name}</div>
              <div className="flex justify-between text-xs text-slate-500">
                <span className="text-green-500">{formatSpeed(t.dlspeed)}</span>
                <span>{(t.progress * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-700 h-1 mt-1 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-500" 
                  style={{ width: `${t.progress * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QBitWidget;
