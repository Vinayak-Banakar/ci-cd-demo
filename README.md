# CI/CD Demo — Docker + Jenkins Pipeline

A production-grade CI/CD pipeline built with Jenkins and Docker, deployed on AWS EC2.

## Architecture
git push → GitHub Webhook → Jenkins Pipeline
↓
docker build (multi-stage)
↓
npm test (Jest inside Docker)
↓
docker push → Docker Hub
↓
Deploy to Staging → Smoke Test
↓
Deploy to Production (manual approval)
## Pipeline Stages

1. **Checkout** — pulls latest code from GitHub
2. **Build Docker Image** — multi-stage build, tests run inside Docker
3. **Run Tests** — Jest tests run inside the container
4. **Push to Docker Hub** — versioned image pushed as `build-number` and `latest`
5. **Deploy to Staging** — container deployed on port 3001
6. **Smoke Test** — hits `/health` endpoint to verify deployment
7. **Deploy to Production** — deploys on port 3000

## Tech Stack

- Node.js + Express
- Docker (multi-stage builds)
- Jenkins (declarative pipeline)
- AWS EC2 (t3.medium)
- Docker Hub (image registry)
- GitHub Webhooks (auto trigger)
- Jest + Supertest (testing)

## Run Locally

```bash
docker pull vinayak0910/ci-cd-demo:latest
docker run -p 3000:3000 vinayak0910/ci-cd-demo:latest
curl http://localhost:3000/health
```

## Jenkins Pipeline

Every `git push` to `main` automatically:
- Builds a new Docker image
- Runs all tests
- Pushes to Docker Hub
- Deploys to staging
- Runs smoke tests

## Live Endpoints (AWS EC2)

- Staging: `http://13.217.88.218:3001/health`
- Production: `http://13.217.88.218:3000/health`
