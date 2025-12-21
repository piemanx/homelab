import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ServiceTile from './components/ServiceTile';
import QBitWidget from './components/QBitWidget';
import PlexWidget from './components/PlexWidget';
import DockerWidget from './components/DockerWidget';
import ConfigModal from './components/ConfigModal';
import { Server, Settings } from 'lucide-react';

function App() {
  const [config, setConfig] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [qbitData, setQbitData] = useState(null);
  const [plexData, setPlexData] = useState(null);
  const [dockerData, setDockerData] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Fetch Config function
  const fetchConfig = () => {
    axios.get('/api/config')
      .then(res => setConfig(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchConfig();

    // Poll Services Status
    const fetchStatus = () => {
      axios.get('/api/status')
        .then(res => setStatuses(res.data))
        .catch(console.error);
    };

    // Poll Widgets
    const fetchWidgets = () => {
       // Only fetch if not previously failed (simple circuit breaker)
       if (!qbitData?.error) {
         axios.get('/api/qbittorrent')
           .then(r => setQbitData(r.data))
           .catch(err => {
             console.error("qBit Error:", err);
             // Set error state to stop polling and show message
             setQbitData({ error: true }); 
           });
       }

       axios.get('/api/plex').then(r => setPlexData(r.data)).catch(console.error);
       fetchDocker();
    };

    const fetchDocker = () => {
       axios.get('/api/docker/containers').then(r => setDockerData(r.data)).catch(console.error);
    }

    fetchStatus();
    fetchWidgets();

    const interval = setInterval(() => {
      fetchStatus();
      fetchWidgets();
    }, 10000); // 10s refresh

    return () => clearInterval(interval);
  }, []);

  const refreshDocker = () => {
      axios.get('/api/docker/containers').then(r => setDockerData(r.data)).catch(console.error);
  };

  if (!config) return <div className="min-h-screen bg-page text-white flex items-center justify-center">Loading MediaHub...</div>;

  return (
    <div className="min-h-screen bg-page text-slate-200 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-brand rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transform hover:scale-105 transition-transform duration-300">
              <Server className="w-10 h-10 text-white" />
            </div>
            <div className="pt-2">
              <h1 className="text-4xl font-extrabold text-white tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                MediaHub
              </h1>
              <p className="text-slate-400 font-medium">Home Media Dashboard</p>
            </div>
          </div>

          <button 
            onClick={() => setIsConfigOpen(true)}
            className="p-3 bg-surface hover:bg-surface-hover rounded-xl border border-white/5 hover:border-white/20 transition-all text-slate-400 hover:text-white"
            title="Configuration"
          >
            <Settings className="w-6 h-6" />
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Service Grid */}
          <div className="xl:col-span-2">
            <h2 className="text-xl font-bold mb-6 text-slate-200 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand rounded-full"></span>
              Services
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {config.services.map((service) => {
                const status = statuses.find(s => s.url === service.url);
                return (
                  <ServiceTile 
                    key={service.url} 
                    service={service} 
                    status={status ? status.online : false} 
                    latency={status ? status.latency : null}
                  />
                );
              })}
            </div>
          </div>

          {/* Widgets Column */}
          <div className="space-y-6 md:space-y-8">
             <QBitWidget data={qbitData} />
             <PlexWidget data={plexData} />
             <DockerWidget containers={dockerData} onAction={refreshDocker} />
          </div>
        </div>

        <ConfigModal 
          isOpen={isConfigOpen} 
          onClose={() => setIsConfigOpen(false)} 
          onConfigSaved={fetchConfig}
        />
      </div>
    </div>
  );
}

export default App;