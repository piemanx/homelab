const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Docker = require('dockerode');

const app = express();
const PORT = process.env.PORT || 3000;
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

app.use(cors());
app.use(express.json());

// Load Config
const CONFIG_PATH = path.join(__dirname, 'config.json');
let config = {};

try {
  const rawConfig = fs.readFileSync(CONFIG_PATH);
  config = JSON.parse(rawConfig);
} catch (error) {
  console.error("Error loading config.json:", error);
}

// API: Get Service Config (public info only)
app.get('/api/config', (req, res) => {
  res.json({ services: config.services });
});

// API: Check Service Status
app.get('/api/status', async (req, res) => {
  const results = await Promise.all(config.services.map(async (service) => {
    try {
      await axios.get(service.url, { timeout: 2000 });
      return { url: service.url, online: true };
    } catch (e) {
      return { url: service.url, online: false };
    }
  }));
  res.json(results);
});

// API: Docker Operations
app.get('/api/docker/containers', async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    // Map to a simpler format
    const simplified = containers.map(c => ({
      id: c.Id,
      name: c.Names[0].replace(/^\//, ''), // Remove leading slash
      state: c.State,
      status: c.Status,
      image: c.Image
    }));
    res.json(simplified);
  } catch (error) {
    console.error("Docker list error:", error);
    res.status(500).json({ error: "Failed to list containers. Is Docker socket mounted?" });
  }
});

app.post('/api/docker/container/:id/:action', async (req, res) => {
  const { id, action } = req.params;
  const allowedActions = ['start', 'stop', 'restart'];
  
  if (!allowedActions.includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }

  try {
    const container = docker.getContainer(id);
    await container[action]();
    res.json({ success: true, message: `Container ${action}ed` });
  } catch (error) {
    console.error(`Docker ${action} error:`, error);
    res.status(500).json({ error: `Failed to ${action} container` });
  }
});

// API: qBittorrent Proxy
// Note: qBittorrent requires cookie-based auth. 
// For simplicity, we'll try to login and then fetch maindata.
let qbitCookie = null;

async function getQbitCookie() {
  if (!config.qbittorrent) return null;
  try {
    const params = new URLSearchParams();
    params.append('username', config.qbittorrent.username);
    params.append('password', config.qbittorrent.password);
    
    const resp = await axios.post(`${config.qbittorrent.url}/api/v2/auth/login`, params, {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': config.qbittorrent.url,
        'Origin': config.qbittorrent.url
      }
    });
    
    // Extract cookie from set-cookie header
    const cookieHeader = resp.headers['set-cookie'];
    if (cookieHeader) {
      // It's usually an array, we join it just in case or pick the first one containing SID
      return cookieHeader[0]; 
    }
  } catch (e) {
    console.error("qBit login failed:", e.message);
  }
  return null;
}

app.get('/api/qbittorrent', async (req, res) => {
  if (!config.qbittorrent) return res.status(500).json({ error: "Not configured" });

  try {
    if (!qbitCookie) {
      qbitCookie = await getQbitCookie();
    }

    const commonHeaders = {
       Cookie: qbitCookie,
       'Referer': config.qbittorrent.url,
       'Origin': config.qbittorrent.url
    };

    // Get Transfer Info
    const transferResp = await axios.get(`${config.qbittorrent.url}/api/v2/transfer/info`, {
      headers: commonHeaders
    });

    // Get Top Torrents (Active)
    const torrentsResp = await axios.get(`${config.qbittorrent.url}/api/v2/torrents/info?filter=all&sort=dlspeed&reverse=true&limit=3`, {
      headers: commonHeaders
    });

    res.json({
      global: transferResp.data,
      topTorrents: torrentsResp.data
    });

  } catch (e) {
    // If unauthorized, maybe cookie expired, reset and retry once could be better logic but simple fail for now
    if (e.response && e.response.status === 403) {
      qbitCookie = null;
    }
    console.error("qBit fetch failed:", e.message);
    res.status(502).json({ error: "Failed to connect to qBittorrent" });
  }
});

// API: Plex Proxy
app.get('/api/plex', async (req, res) => {
  if (!config.plex) return res.status(500).json({ error: "Not configured" });

  try {
    // Get Sessions (Now Playing)
    const sessions = await axios.get(`${config.plex.url}/status/sessions?X-Plex-Token=${config.plex.token}`, {
        headers: { 'Accept': 'application/json' }
    });

    // Get Recently Added
    const recent = await axios.get(`${config.plex.url}/library/recentlyAdded?X-Plex-Token=${config.plex.token}&limit=3`, {
        headers: { 'Accept': 'application/json' }
    });

    res.json({
      sessions: sessions.data.MediaContainer.Metadata || [],
      recent: recent.data.MediaContainer.Metadata || []
    });

  } catch (e) {
    console.error("Plex fetch failed:", e.message);
    res.status(502).json({ error: "Failed to connect to Plex" });
  }
});

// Serve Frontend (Production)
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
