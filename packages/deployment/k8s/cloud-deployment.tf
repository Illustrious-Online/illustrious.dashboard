resource "kubernetes_deployment" "illustrious_cloud_deployment" {
  metadata {
    name = "ill-cloud"
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "ill-cloud"
      }
    }

    template {
      metadata {
        labels = {
          app = "ill-cloud"
        }
      }

      spec {
        container {
          name  = "ill-cloud"
          image = "registry.digitalocean.com/illustrious-online/ill-cloud:latest"
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
    name = "ill-cloud-service"
  }

  spec {
    selector = {
      app = "ill-cloud"
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
    name = "ill-cloud-ingress"
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
            service_name = "ill-cloud-service"
            service_port = 80
          }
        }
      }
    }
  }
}