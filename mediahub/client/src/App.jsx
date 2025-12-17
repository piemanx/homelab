import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ServiceTile from './components/ServiceTile';
import QBitWidget from './components/QBitWidget';
import PlexWidget from './components/PlexWidget';
import { Server } from 'lucide-react';

function App() {
  const [config, setConfig] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [qbitData, setQbitData] = useState(null);
  const [plexData, setPlexData] = useState(null);

  useEffect(() => {
    // Fetch Config
    axios.get('/api/config')
      .then(res => setConfig(res.data))
      .catch(err => console.error(err));

    // Poll Services Status
    const fetchStatus = () => {
      axios.get('/api/status')
        .then(res => setStatuses(res.data))
        .catch(console.error);
    };

    // Poll Widgets
    const fetchWidgets = () => {
       axios.get('/api/qbittorrent').then(r => setQbitData(r.data)).catch(console.error);
       axios.get('/api/plex').then(r => setPlexData(r.data)).catch(console.error);
    };

    fetchStatus();
    fetchWidgets();

    const interval = setInterval(() => {
      fetchStatus();
      fetchWidgets();
    }, 10000); // 10s refresh

    return () => clearInterval(interval);
  }, []);

  if (!config) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading MediaHub...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Server className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">MediaHub</h1>
            <p className="text-slate-400">Home Media Dashboard</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Service Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-slate-300">Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {config.services.map((service) => {
                const status = statuses.find(s => s.url === service.url);
                return (
                  <ServiceTile 
                    key={service.url} 
                    service={service} 
                    status={status ? status.online : false} 
                  />
                );
              })}
            </div>
          </div>

          {/* Widgets Column */}
          <div className="space-y-8">
             <QBitWidget data={qbitData} />
             <PlexWidget data={plexData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;