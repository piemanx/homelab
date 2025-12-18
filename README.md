# Homelab

This repository serves as a monorepo for scripts, configurations, and applications integral to the functioning of my homelab environment.

The primary goal is to maintain a version-controlled, reproducible setup for all self-hosted services, eventually packaging key components into production-ready Docker images.

## 📂 Current Projects

### [MediaHub](./mediahub)
A responsive, personal dashboard for your home media server.
-   **Tech Stack:** React, Node.js, Docker.
-   **Features:** Real-time service health checks (Sonarr, Radarr), qBittorrent speed widget, and Plex "Now Playing".
-   **Status:** Active Development.

## 🚀 Getting Started

### Prerequisites
-   **OS:** Linux (Debian/Ubuntu/Proxmox preferred)
-   **Containerization:** Docker Engine & Docker Compose
-   **Tools:** Git, Node.js (for local dev)

### Installation
Clone the repository to your server or development machine:

```bash
git clone git@github.com:piemanx/homelab.git
cd homelab
```

Refer to the specific project subdirectories (e.g., [`mediahub/README.md`](./mediahub/README.md)) for detailed configuration and deployment instructions.

## 🔜 Roadmap

- [ ] **Infrastructure as Code:** Add Ansible playbooks for server provisioning.
- [ ] **Monitoring:** Integrate Prometheus/Grafana configurations.
- [ ] **Backups:** Add scripts for automated Proxmox and Docker volume backups.
- [ ] **CI/CD:** Expand GitHub Actions to automate testing and deployment for all modules.
