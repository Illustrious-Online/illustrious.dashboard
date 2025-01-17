terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
}

variable "dop_token" {
  description = "DigitalOcean Personal Access Token"
  type        = string
  default     = ""
}

provider "digitalocean" {
  token = var.dop_token != "" ? var.dop_token : env.DOP_TOKEN
}

provider "kubernetes" {
  config_path = "${path.module}/kubeconfig.yaml"
}

resource "digitalocean_kubernetes_cluster" "main" {
  name       = "illustrious-cluster"
  region     = "nyc3"
  version    = "1.31.1-do.5"
  node_pool {
    name       = "default-node-pool"
    size       = "s-1vcpu-2gb"
    auto_scale = true
    min_nodes  = 2
    max_nodes  = 3
  }
}

output "kube_config" {
  value     = digitalocean_kubernetes_cluster.main.kube_config.0.raw_config
  sensitive = true
}

resource "local_file" "kubeconfig" {
  content  = digitalocean_kubernetes_cluster.main.kube_config.0.raw_config
  filename = "${path.module}/kubeconfig.yaml"
}