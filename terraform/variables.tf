variable "project_id" {
  description = "The GCP project ID"
}

variable "region" {
  description = "The GCP region"
  default     = "us-central1"
}


variable "zone" {
  description = "The GCP zone"
  default     = "us-central1-a"
}

variable "gcr_var" {
  description = "The Artifact Registry repository name and hostname"
  type        = string
  default     = "gcr.io"
}
