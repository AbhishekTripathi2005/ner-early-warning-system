# 🏗️ Infrastructure & Container Orchestration

## 📌 Kya Banaya Gaya Hai (Overview)
Yeh folder project ki multi-tier infrastructure deploy karne ke saare templates provide karta hai:
1. **Docker Compose (`docker-compose.yml`)**: Single-command execution of the entire ecosystem:
   - `postgis`: PostgreSQL 15 with PostGIS spatial geometry extensions.
   - `redis`: In-memory event broker for high-speed queueing.
   - `backend`: FastAPI asynchronous web API.
   - `celery-worker`: Distributed worker monitoring landslide thresholds and firing alerts.
   - `ml-engine`: Python microservice calculating real-time Landslide Susceptibility Index (LSI).
   - `frontend`: Next.js 14 MapLibre GIS dashboard.
2. **PostGIS Initialization Script (`scripts/init-db.sql`)**: Database schema creation, PostGIS extension enablement, and spatial indexing (GiST).
3. **Production Kubernetes Manifests (`k8s/`)**: StatefulSets and Deployments with health probes and resource limits ready for Cloud deployment (AWS EKS / GCP GKE / DigitalOcean).

---

## 🚀 Kaise Chalayein (Quick Commands)

### 1. Launch All Microservices (Docker Compose)
```bash
cd infra

# Containers build and launch in background
docker compose up --build -d

# Real-time container logs check karein
docker compose logs -f

# Containers stop karne ke liye
docker compose down
```

### 2. Verify Container Health
```bash
docker ps
```
Sabhi 6 containers healthy state mein hone chahiye.

---

## 🛰️ Real Data Source Integration Plan (Production Hosting)

| Resource | Development Default | Production Target |
| :--- | :--- | :--- |
| **PostGIS DB** | Dockerized Alpine PostGIS container | Managed AWS RDS for PostgreSQL with PostGIS extension enabled |
| **Redis Cache** | Local Redis 7 container | AWS ElastiCache for Redis (Cluster mode) |
| **Compute / Cluster** | Docker Compose on single VM | Kubernetes (EKS/GKE) with Horizontal Pod Autoscaler (HPA) |
| **Static Assets & Tile Cache** | Local Next.js server | AWS CloudFront CDN / Cloudflare Geo-caching |
