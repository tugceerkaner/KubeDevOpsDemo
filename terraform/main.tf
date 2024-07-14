provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}


provider "kubernetes" {
  host                   = google_container_cluster.primary.endpoint
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(google_container_cluster.primary.master_auth[0].cluster_ca_certificate)
}

data "google_client_config" "default" {}

resource "google_container_cluster" "primary" {
  name     = "terraform-cluster"
  location = var.zone
  initial_node_count = 3
  

  remove_default_node_pool = true
  node_config {
    machine_type = "e2-medium"
    disk_size_gb = "20"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }
}


resource "google_container_node_pool" "primary_nodes" {
  cluster   = google_container_cluster.primary.name
  location  = google_container_cluster.primary.location
  initial_node_count = 3

  node_config {
    machine_type = "e2-medium"
    disk_size_gb = 20
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }

  autoscaling {
    min_node_count = 1
    max_node_count = 5
  }
}


resource "google_compute_address" "frontend_ip" {
  name = "frontend-ip"
  region = "us-central1"
}

resource "google_compute_address" "backend_ip" {
  name = "backend-ip"
  region = "us-central1"
}

resource "google_artifact_registry_repository" "repo" {
  provider = google-beta
  location      = "us"
  repository_id = "gcr.io"
  format       = "DOCKER"
}

resource "kubernetes_namespace" "backend_namespace" {
  metadata {
    name = "backend-namespace"
  }
}

resource "kubernetes_namespace" "frontend_namespace" {
  metadata {
    name = "frontend-namespace"
  }
}

resource "kubernetes_secret" "db_credentials" {
  metadata {
    name      = "db-credentials"
    namespace = kubernetes_namespace.backend_namespace.metadata[0].name
  }
  data = {
    DB_HOST     = base64encode("db")
    DB_NAME     = base64encode("devops_db")
    DB_USER     = base64encode("dindygomez")
    DB_PASSWORD = base64encode("postgres")
  }
}

resource "kubernetes_secret" "postgres_credentials" {
  metadata {
    name      = "postgres-credentials"
    namespace = kubernetes_namespace.backend_namespace.metadata[0].name
  }
  data = {
    POSTGRES_DB     = base64encode("devops_db")
    POSTGRES_USER   = base64encode("dindygomez")
    POSTGRES_PASSWORD = base64encode("postgres")
  }
}

