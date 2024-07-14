output "cluster_name" {
  value = google_container_cluster.primary.name
}

output "backend_ip" {
  value = google_compute_address.backend_ip.address
}

output "frontend_ip" {
  value = google_compute_address.frontend_ip.address
}