# MediaHub

A responsive, personal dashboard for your home media server, built with React, Node.js, and Docker.

![MediaHub](https://via.placeholder.com/800x400?text=MediaHub+Dashboard+Preview)

## Features

*   **Service Grid:** Monitor the status of your hosted services (Sonarr, Radarr, etc.) with real-time health checks.
*   **qBittorrent Widget:** View global transfer speeds and the top 3 active torrents.
*   **Plex Widget:** See what's "Now Playing" or view "Recently Added" media.
*   **Configuration:** Simple `config.json` file for all settings.
*   **Dockerized:** Easy deployment with Docker and Docker Compose.

## 🚀 Quick Start (Local)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/piemanx/homelab.git
    cd homelab/mediahub
    ```

2.  **Configure:**
    Edit `server/config.json` to match your environment (see [Configuration](#configuration) below).

3.  **Run with Docker Compose:**
    ```bash
    docker-compose up -d --build
    ```

4.  **Access:**
    Open [http://localhost:7979](http://localhost:7979) in your browser.

---

## ⚙️ Configuration

The application is controlled by a single file: `server/config.json`.

**Example `config.json`:**

```json
{
  "services": [
    { "name": "Sonarr", "url": "http://192.168.1.95:8989", "icon": "Tv" },
    { "name": "Radarr", "url": "http://192.168.1.95:7878", "icon": "Film" },
    { "name": "Prowlarr", "url": "http://192.168.1.95:9696", "icon": "Search" },
    { "name": "Jellyfin", "url": "http://192.168.1.95:8096", "icon": "Play" }
  ],
  "qbittorrent": {
    "url": "http://192.168.1.95:8080",
    "username": "admin",
    "password": "YOUR_PASSWORD"
  },
  "plex": {
    "url": "http://192.168.1.230:32400",
    "token": "YOUR_PLEX_TOKEN"
  }
}
```

### Supported Icons
Icons are provided by [Lucide React](https://lucide.dev/icons/). You can use any valid Lucide icon name (PascalCase) in the `"icon"` field (e.g., `Tv`, `Film`, `Server`, `Wifi`, `HardDrive`, `Cpu`).

### Obtaining Plex Token
1.  Sign in to Plex.tv.
2.  Click on any media item > "Get Info" > "View XML".
3.  Look for `X-Plex-Token` in the URL bar.

---

## 📦 Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically builds and pushes the Docker image to the **GitHub Container Registry (GHCR)** whenever changes are pushed to the `main` branch.

To deploy or update the application on your server, follow these steps:

### 1. Prepare Server
Ensure you have a `config.json` file on your server (e.g., in `~/mediahub/config.json`) containing your production credentials.

### 2. Login to GHCR (First time only)
You need a GitHub Personal Access Token (PAT) with `read:packages` permission.
```bash
echo YOUR_GITHUB_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

### 3. Pull & Run
Run the following commands to update and restart the container:

```bash
# Pull the latest image
docker pull ghcr.io/piemanx/homelab/mediahub:latest

# Remove the old container (if exists)
docker stop mediahub || true && docker rm mediahub || true

# Start the new container
# Note: We mount the config.json from the host system
docker run -d \
  --name mediahub \
  --restart unless-stopped \
  -p 7979:3000 \
  -v ~/mediahub/config.json:/app/server/config.json \
  ghcr.io/piemanx/homelab/mediahub:latest
```

---

## 🛠 Troubleshooting

**1. Service status is always "Offline" (Red Dot)**
*   **Cause:** The Node.js backend inside the container cannot reach your service IPs.
*   **Fix:** Ensure your services (Sonarr, etc.) are reachable from the Docker network. If they are on the same host, use the host's LAN IP (e.g., `192.168.1.x`), NOT `localhost` or `127.0.0.1`.

**2. qBittorrent Widget says "Loading..." or Error**
*   **Cause:** Auth failure or API version mismatch.
*   **Fix:**
    *   Check username/password in `config.json`.
    *   Ensure "Bypass authentication for clients on localhost" is **disabled** in qBittorrent if testing from outside the container, OR ensure the container IP is whitelisted.
    *   This app uses qBittorrent API v2.

**3. Plex Widget is empty**
*   **Cause:** Invalid Token or Network issue.
*   **Fix:** Verify the `X-Plex-Token`. Check docker logs: `docker logs mediahub`.

**4. Container keeps restarting**
*   **Cause:** Missing or invalid config.
*   **Fix:** Check logs: `docker logs mediahub`. Ensure `server/config.json` is valid JSON and mounted correctly.

## 💻 Development

Run frontend and backend separately for development:

**Backend:**
```bash
cd mediahub/server
npm install
node server.js
```

**Frontend:**
```bash
cd mediahub/client
npm install
npm run dev
```
