# KubeDevOpsDemo  (Docker Swarm)
 
 Requires Docker Images to be available in the Google Artifact Registry for container reference.

## Build, tag, and push the images at Google Artifact Registry

1.  Authenticate Docker with GCR
```
    gcloud auth configure-docker
```
2. Backend image
```
    docker build -t gcr.io/micro-docker-test/deploy-backend:latest ./backend
    docker push gcr.io/micro-docker-test/deploy-backend:latest
```
3. Frontend  image

```
    docker build -t gcr.io/micro-docker-test/deploy-frontend:latest ./frontend
    docker push gcr.io/micro-docker-test/deploy-frontend:latest
```

## Running Docker containers locally

1. Build the docker containers from Docker Compose
```
    docker-compose up --build
```

2. Stops and deletes the containers, networks, volumes and images
```
    docker-compose down -v
```
