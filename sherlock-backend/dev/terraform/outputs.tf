output "ssh_command" {
  description = "SSH command to connect to the VM"
  value       = "ssh -i ${var.private_key_path} ${var.ssh_user}@${var.host}"
}