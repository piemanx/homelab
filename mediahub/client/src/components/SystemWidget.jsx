import React from 'react';
import { Cpu, HardDrive, Database } from 'lucide-react';

const SystemWidget = ({ data }) => {
  if (!data) return <div className="p-6 bg-surface rounded-2xl animate-pulse h-48 border border-white/5">Loading System...</div>;

  const { cpu, mem, disk } = data;

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-xl border border-white/5 hover:border-white/10 transition-colors">
      <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
        <Cpu className="w-6 h-6 text-brand" />
        System Resources
      </h3>

      <div className="space-y-6">
        
        {/* CPU */}
        <div>
          <div className="flex justify-between mb-2 text-sm font-medium">
             <span className="text-slate-400">CPU Load</span>
             <span className="text-slate-200">{cpu.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-1000 ${cpu > 80 ? 'bg-red-500' : 'bg-brand'}`} 
              style={{ width: `${Math.min(cpu, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Memory */}
        <div>
          <div className="flex justify-between mb-2 text-sm font-medium">
             <span className="text-slate-400 flex items-center gap-2"><Database className="w-3 h-3" /> Memory</span>
             <span className="text-slate-200">{formatBytes(mem.used)} / {formatBytes(mem.total)}</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-1000 ${mem.percent > 85 ? 'bg-red-500' : 'bg-purple-500'}`} 
              style={{ width: `${Math.min(mem.percent, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Disk (First disk only for compactness, or map list) */}
        {disk.length > 0 && (
          <div>
            <div className="flex justify-between mb-2 text-sm font-medium">
               <span className="text-slate-400 flex items-center gap-2"><HardDrive className="w-3 h-3" /> Disk ({disk[0].mount})</span>
               <span className="text-slate-200">{Math.round(disk[0].use)}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-2.5 rounded-full transition-all duration-1000 ${disk[0].use > 90 ? 'bg-red-500' : 'bg-teal-500'}`} 
                style={{ width: `${Math.min(disk[0].use, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-right text-slate-500 mt-1">
              {formatBytes(disk[0].used)} used of {formatBytes(disk[0].size)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SystemWidget;
