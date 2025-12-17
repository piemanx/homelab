# MediaHub

A personal dashboard for your home media server.

## Quick Start

1.  **Configure:** Edit `server/config.json` with your actual service URLs and credentials.
2.  **Run:**
    ```bash
    docker-compose up -d --build
    ```
3.  **Access:** Open [http://localhost:7979](http://localhost:7979)

## Architecture

-   **Frontend:** React (Vite) + Tailwind CSS
-   **Backend:** Node.js + Express (API & Static File Server)
-   **Deployment:** Docker
