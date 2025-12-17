import React from 'react';
import * as Icons from 'lucide-react';

const ServiceTile = ({ service, status }) => {
  const IconComponent = Icons[service.icon] || Icons.HelpCircle;

  return (
    <a 
      href={service.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors shadow-lg group relative"
    >
      <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${status ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
      
      <IconComponent className="w-12 h-12 text-slate-300 group-hover:text-white transition-colors mb-3" />
      
      <span className="font-semibold text-lg text-slate-200 group-hover:text-white">{service.name}</span>
    </a>
  );
};

export default ServiceTile;
