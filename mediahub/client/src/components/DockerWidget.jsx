import React, { useState } from 'react';
import axios from 'axios';
import { Box, Play, Square, RotateCw } from 'lucide-react';

const DockerWidget = ({ containers, onAction }) => {
  const [loadingId, setLoadingId] = useState(null);

  const handleAction = async (id, action) => {
    setLoadingId(id);
    try {
      await axios.post(`/api/docker/container/${id}/${action}`);
      if (onAction) onAction(); // Refresh list
    } catch (error) {
      console.error("Docker action failed:", error);
    } finally {
      setLoadingId(null);
    }
  };

  if (!containers) return <div className="p-6 bg-surface rounded-2xl animate-pulse h-48 border border-white/5">Loading Docker...</div>;

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-xl border border-white/5 hover:border-white/10 transition-colors">
      <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
        <Box className="w-6 h-6 text-blue-400" />
        Docker Containers
      </h3>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
        {containers.map((c) => (
          <div key={c.id} className="bg-surface-active p-3 rounded-lg border border-white/5 flex items-center justify-between gap-3 group hover:border-white/10 transition-all">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${c.state === 'running' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-500'}`} />
                <div className="font-medium text-slate-200 truncate" title={c.name}>{c.name}</div>
              </div>
              <div className="text-xs text-slate-500 truncate pl-4">{c.image}</div>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               {c.state !== 'running' ? (
                 <button 
                   onClick={() => handleAction(c.id, 'start')}
                   disabled={loadingId === c.id}
                   className="p-1.5 hover:bg-green-500/20 text-slate-400 hover:text-green-500 rounded transition-colors disabled:opacity-50"
                   title="Start"
                 >
                   <Play className="w-4 h-4" />
                 </button>
               ) : (
                 <button 
                   onClick={() => handleAction(c.id, 'stop')}
                   disabled={loadingId === c.id}
                   className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded transition-colors disabled:opacity-50"
                   title="Stop"
                 >
                   <Square className="w-4 h-4" />
                 </button>
               )}
               <button 
                 onClick={() => handleAction(c.id, 'restart')}
                 disabled={loadingId === c.id}
                 className="p-1.5 hover:bg-blue-500/20 text-slate-400 hover:text-blue-500 rounded transition-colors disabled:opacity-50"
                 title="Restart"
               >
                 <RotateCw className={`w-4 h-4 ${loadingId === c.id ? 'animate-spin' : ''}`} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DockerWidget;
