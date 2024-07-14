provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
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

