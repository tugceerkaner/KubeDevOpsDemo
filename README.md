# KubeDevOpsDemo
 practice project on Devops


## Pushing Images to Google Artifact Registry

    Build the docker containers from Docker Compose
```
    cd postgres
    docker build -t gcr.io/micro-docker-test/postgres:latest . 
    docker push gcr.io/micro-docker-test/postgres:latest

    cd backend
    docker build -t gcr.io/micro-docker-test/backend:latest . 
    docker push gcr.io/micro-docker-test/backend:latest

    cd frontend
    docker build -t gcr.io/micro-docker-test/frontend:latest . 
    docker push gcr.io/micro-docker-test/frontend:latest

```

## Reserve IP address for the backend and frontend IP

    Build the docker containers from Docker Compose
```
    gcloud compute addresses create backend-ip --region us-central1 
    gcloud compute addresses describe backend-ip --region us-central1 --format="get(address)"


    gcloud compute addresses create frontend-ip --region us-central1 
    gcloud compute addresses describe frontend-ip --region us-central1 --format="get(address)"

```
## Create Cluster

 Create cluster
```
    gcloud container clusters create kube-cluster --zone us-central1-a --num-nodes=3 
    gcloud container clusters get-credentials kube-cluster --zone us-central1-a
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

