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

provider "digitalocean" {
  token = "dop_v1_eaad4c331875bda7cfdccd55ea29758743ae2699a5c37cbe669f4b17446c19d4"
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