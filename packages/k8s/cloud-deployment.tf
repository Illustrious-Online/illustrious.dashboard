resource "kubernetes_deployment" "illustrious_cloud" {
  metadata {
    name = "illustrious-cloud"
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "illustrious-cloud"
      }
    }

    template {
      metadata {
        labels = {
          app = "illustrious-cloud"
        }
      }

      spec {
        container {
          name  = "illustrious-cloud"
          image = "registry.digitalocean.com/illustrious-online/illustrious-cloud:latest"
          port {
            container_port = 4000
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "illustrious_cloud_service" {
  metadata {
    name = "illustrious-cloud-service"
  }

  spec {
    selector = {
      app = "illustrious-cloud"
    }

    port {
      port        = 80
      target_port = 4000
    }
    type = "LoadBalancer"
  }
}

resource "kubernetes_ingress" "illustrious_cloud_ingress" {
  metadata {
    name = "illustrious-cloud-ingress"
    annotations = {
      "nginx.ingress.kubernetes.io/rewrite-target" = "/"
    }
  }

  spec {
    rule {
      host = "api.illustrious.cloud"
      http {
        path {
          path = "/"
          backend {
            service_name = "illustrious-cloud-service"
            service_port = 80
          }
        }
      }
    }
  }
}