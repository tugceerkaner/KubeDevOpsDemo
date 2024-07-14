output "cluster_name" {
  value = google_container_cluster.primary.name
}

output "frontend_ip" {
  value = google_compute_address.frontend_ip.address
}

output "backend_ip" {
  value = google_compute_address.backend_ip.address
}