# KubeDevOpsDemo

This project demonstrates the use of Docker, Kubernetes, Helm, and ArgoCD to deploy a microservice-based application.

## Project Structure
- **backend/**: Python Flask application for the backend service.
- **frontend/**: Nginx-based frontend service.
- **helm_charts/**: Helm charts for Kubernetes deployment.
- **postgres/**: PostgreSQL database setup.

## Requirements
- Docker
- Kubernetes
- Helm
- ArgoCD
- GCP account

# Setting Up Google Cloud CLI and GKE Cluster
## Set Up Google Cloud CLI
- General Commands
```commandline
gcloud auth login
gcloud config set project <project-id>
```
- Project Commands
```commandline
gcloud auth login
gcloud config set project containerization-projects
```

## Docker Authentication
```commandline
gcloud auth configure-docker
```

## Build and Push Docker Images to GCR
- General Commands
```commandline
docker build -t gcr.io/<project-id>/<image-name>:<tag> -f <Dockerfile-path> <context-path>
docker push gcr.io/<project-id>/<image-name>:<tag>
```
- Project Commands

1) Commands to build and push the Docker images for postgres:
```commandline
docker build -t gcr.io/containerization-projects/postgres:latest -f postgres/Dockerfile ./postgres
docker push gcr.io/containerization-projects/postgres:latest
```

2) Commands to build and push the Docker images for backend:
```commandline
docker build -t gcr.io/containerization-projects/backend:latest -f backend/Dockerfile ./backend
docker push gcr.io/containerization-projects/backend:latest
```
3) Commands to build and push the Docker images for frontend:
```commandline
docker build -t gcr.io/containerization-projects/frontend:latest -f frontend/Dockerfile ./frontend
docker push gcr.io/containerization-projects/frontend:latest
```

## Create a GKE Cluster
Commands to create a Kubernetes cluster on Google Kubernetes Engine
- General Commands
```commandline
gcloud container clusters create <cluster-name> --zone <zone> --num-nodes=<num-nodes>
```
- Project Commands
```commandline
gcloud container clusters create kube-cluster --zone us-central1-a --num-nodes=3
```
## Authenticate to the GKE Cluster
Commands to get authentication credentials for the GKE cluster
- General Commands
```commandline
gcloud container clusters get-credentials <cluster-name> --zone <zone>
```
- Project Commands
```commandline
gcloud container clusters get-credentials kube-cluster --zone us-central1-a
```
## Reserve Static IP Addresses
- General Commands
```commandline
gcloud compute addresses create <ip-name> --region <region>
gcloud compute addresses describe <ip-name> --region <region> --format="get(address)"
```
- Ip addresses will be used inside application code and yaml files
- Project Commands
1) Commands to reserve a static IP address for the backend service
```commandline
gcloud compute addresses create backend-ip --region us-central1 
gcloud compute addresses describe backend-ip --region us-central1 --format="get(address)"
```

2) Commands to reserve a static IP address for the frontend service
```commandline
gcloud compute addresses create frontend-ip --region us-central1 
gcloud compute addresses describe frontend-ip --region us-central1 --format="get(address)"
```

# Helm Charts
After creating helm charts directory and k8s manifest files inside this directory, test it locally
## Deploy the application using Helm charts - Local 
- Install helm chart on Windows with chocolatey
```commandline
choco install kubernetes-helm
```
- Verify the installation of helm
```commandline
helm version
```
## Install releases
- General Commands
```commandline
helm install <release-name> <chart-path> --create-namespace --namespace <namespace>
```
- Project Commands
1) Command for deploying the postresql
```commandline
helm install postgres-release ./helm_charts/postgres --create-namespace --namespace postgres-namespace
```
- Verify the postgres deployment
```commandline
kubectl get all -n postgres-namespace
kubectl get pv -n postgres-namespace
kubectl get pvc -n postgres-namespace
```
2) Command for deploying the backend
```commandline
helm install backend-release ./helm_charts/backend --create-namespace --namespace backend-namespace
```
- Verify the backend deployment
```commandline
kubectl get all -n backend-namespace
```
3) Command for deploying the frontend
```commandline
helm install frontend-release ./helm_charts/frontend --create-namespace --namespace frontend-namespace
```
- Verify the frontend deployment
```commandline
kubectl get all -n frontend-namespace
```
## Uninstall releases and delete resources
- General Commands
```commandline
helm uninstall <release-name> --namespace <namespace>
```
- Project Commands
1) Uninstall releases
```commandline
helm uninstall postgres-release --namespace postgres-namespace
helm uninstall backend-release --namespace backend-namespace
helm uninstall frontend-release --namespace frontend-namespace
```
2) Control resources based on namespaces
```commandline
kubectl get all -n postgres-namespace
kubectl get all -n backend-namespace
kubectl get all -n frontend-namespace
kubectl get pv -n postgres-namespace
kubectl get pvc -n postgres-namespace
```
3) Delete namespaces
```commandline
kubectl delete namespace backend-namespace
kubectl delete namespace frontend-namespace
kubectl delete namespace postgres-namespace
```
# Setting Up ArgoCD for Automatic Deployment
## ArgoCD namespace creation
```commandline
kubectl create namespace argocd
```
## Install ArgoCD on Kubernetes Cluster
```commandline
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```
## Access ArgoCD UI
- Patch the argocd-server Service to Use LoadBalancer
```commandline
kubectl get service -n argocd
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
```
- If previous command gives an error, the configuration can be changed manually.
```commandline
kubectl edit svc argocd-server -n argocd
# Change the type to LoadBalancer 
```

## Get the External IP Address
```commandline
kubectl get svc argocd-server -n argocd
```

## Retrieve the initial admin password
```commandline
kubectl get secrets -n argocd argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

## Create ArgoCD Application
ArgoCD is configured to automate the deployment. The `argocd-application.yaml` file, which describes the application setup, will be created to monitor the helm charts.

## Deploy ArgoCD Application
- General Commands
```commandline
kubectl apply -f <path-to-argocd-application.yaml>
```
- Project Commands
1) Apply the ArgoCD application configuration
```commandline
kubectl apply -f argocd-application.yaml
```

2) List resources in ns
```commandline
kubectl get all -n frontend-namespace
kubectl get all -n backend-namespace
kubectl get all -n postgres-namespace
kubectl get pv -n postgres-namespace
kubectl get pvc -n postgres-namespace
```

## Monitor and Verify Deployment
ArgoCD UI is accessed to monitor the deployment status and ensure the application is deployed successfully.

# Delete All Resources
## Deleting the ArgoCD Application
```commandline
kubectl delete -f argocd-application.yaml
```
- Verifying the Deletion
```commandline
kubectl get applications -n argocd
```

## Cleaning Up Namespaces
```commandline
kubectl delete namespace backend-namespace
kubectl delete namespace frontend-namespace
kubectl delete namespace postgres-namespace
```

- Deleting ArgoCD Namespace
```commandline
kubectl delete namespace argocd
```

- Verifying Deletion
```commandline
kubectl get namespaces
```

## Delete cluster
- List cluster
```commandline
gcloud container clusters list
```

- Delete cluster
```commandline
gcloud container clusters delete kube-cluster --zone us-central1-a
```
