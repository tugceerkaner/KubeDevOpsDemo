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
## Prerequisites

Create an overlay Network:

```
    sudo docker network create -d overlay --attachable kube_net
```

Ensure that you pull your artifact repository image in every node:

```
    docker pull gcr.io/micro-docker-test/deploy-frontend:latest
    docker pull gcr.io/micro-docker-test/deploy-backend:latest
```

## Running the service


Create a docker-compose.yaml in your manager-node and copy the contents of docker-compose.yaml

```
    nano docker-compose.yaml
```

Deploy your stack with DB and backend service

```
    sudo docker stack deploy -c docker-compose.yaml devops_stack
```

Create the frontend service

```
    sudo docker service create \
        --name devops_stack_frontend \
        --replicas 2 \
        --network kube_net \
        --env TZ=America/Toronto \
        --publish 3000:3000 \
        gcr.io/micro-docker-test/deploy-frontend:latest
```

Deploy your stack with DB and backend service

```
    sudo docker stack ps devops_stack
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
