# KubeDevOpsDemo
 practice project on Devops


## Running Docker containers locally

1. Build the docker containers from Docker Compose
```
    docker-compose up --build
```

2. Stops and deletes the containers, networks, volumes and images
```
    docker-compose down -v
```

##  Apply Manifests and Deploy

1.  Apply postgres manifests

```
    kubectl apply -f postgres/postgres-namespace.yaml
    kubectl apply -f postgres/postgres-configmap.yaml
    kubectl apply -f postgres/postgres-secret.yaml
    kubectl apply -f postgres/postgres-init-config.yaml
    kubectl apply -f postgres/postgres-pvc.yaml
    kubectl apply -f postgres/postgres-deployment.yaml
    kubectl apply -f postgres/postgres-service.yaml
```

2. Apply backend manifests

```
    kubectl apply -f backend/backend-namespace.yaml
    kubectl apply -f backend/backend-configmap.yaml
    kubectl apply -f backend/backend-secret.yaml
    kubectl apply -f backend/backend-deployment.yaml
    kubectl apply -f backend/backend-service.yaml
```

3. Apply frontend manifests
```
    kubectl apply -f frontend/frontend-namespace.yaml
    kubectl apply -f frontend/frontend-deployment.yaml
    kubectl apply -f frontend/frontend-service.yaml
```

##  Delete All Resources

1.  Delete PostgreSQL resources

```
    kubectl delete -f postgres/postgres-service.yaml
    kubectl delete -f postgres/postgres-deployment.yaml
    kubectl delete -f postgres/postgres-pvc.yaml
    kubectl delete -f postgres/postgres-init-config.yaml
    kubectl delete -f postgres/postgres-secret.yaml
    kubectl delete -f postgres/postgres-configmap.yaml
    kubectl delete -f postgres/postgres-namespace.yaml
```

2.  Delete Backend resources

```
    kubectl delete -f backend/backend-service.yaml
    kubectl delete -f backend/backend-deployment.yaml
    kubectl delete -f backend/backend-secret.yaml
    kubectl delete -f backend/backend-configmap.yaml
    kubectl delete -f backend/backend-namespace.yaml
```

3. Delete Frontend resources
```
    kubectl delete -f frontend/frontend-namespace.yaml
    kubectl delete -f frontend/frontend-deployment.yaml
    kubectl delete -f frontend/frontend-service.yaml
```

