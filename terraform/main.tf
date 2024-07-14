provider "google" {
  project = "micro-docker-test"
  region  = "us-central1"
  zone    = "us-central1-a"
}

resource "google_container_cluster" "primary" {
  name     = "terraform-cluster"
  location = "us-central1-a"
  initial_node_count = 3

  node_config {
    machine_type = "e2-medium"
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
  repository_id = var.gcr_var
  format       = "DOCKER"
  description  = "Docker repository"
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
    DB_HOST     = "db"
    DB_NAME     = "devops_db"
    DB_USER     = "dindygomez"
    DB_PASSWORD = "postgres"
  }
}


resource "kubernetes_secret" "postgres_credentials" {
  metadata {
    name      = "postgres-credentials"
    namespace = kubernetes_namespace.backend_namespace.metadata[0].name
  }
  data = {
    POSTGRES_DB     = "devops_db"
    POSTGRES_USER   = "dindygomez"
    POSTGRES_PASSWORD = "postgres"
  }
}
