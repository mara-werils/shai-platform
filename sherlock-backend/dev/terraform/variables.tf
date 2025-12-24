variable "host" {
  description = "IP or hostname of the target VM"
  type        = string
}

variable "ssh_user" {
  description = "SSH user on the target VM"
  type        = string
}

variable "private_key_path" {
  description = "Path to the SSH private key"
  type        = string
}

variable "volume_path" {
  description = "Path to volume"
  type        = string
}

variable "web_image" {
  description = "Docker image for web service"
  type        = string
}

variable "api_image" {
  description = "Docker image for api"
  type        = string
}

variable "github_username" {
  description = "GitHub username for GHCR login"
  type        = string
}

variable "github_token" {
  description = "GitHub token for GHCR login"
  type        = string
  sensitive   = true
}
