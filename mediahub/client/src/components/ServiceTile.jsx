import React from 'react';
import * as Icons from 'lucide-react';

const ServiceTile = ({ service, status, latency }) => {
  const IconComponent = Icons[service.icon] || Icons.HelpCircle;

  return (
    <a 
      href={service.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center p-6 bg-surface rounded-2xl border border-white/5 hover:bg-surface-hover hover:border-brand/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute top-3 right-3 flex items-center gap-2">
         {status && latency !== null && (
           <span className="text-[10px] font-mono font-medium text-slate-500 bg-black/20 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
             {latency}ms
           </span>
         )}
         <div className={`w-3 h-3 rounded-full transition-shadow duration-300 ${status ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <IconComponent className="w-12 h-12 text-slate-400 group-hover:text-brand transition-colors duration-300 mb-4 relative z-10" />
      
      <span className="font-semibold text-lg text-slate-300 group-hover:text-white transition-colors duration-300 relative z-10 text-center">{service.name}</span>
    </a>
  );
};

export default ServiceTile;
