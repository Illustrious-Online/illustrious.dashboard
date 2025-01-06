resource "kubernetes_deployment" "illustrious_site" {
  metadata {
    name = "illustrious-site"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "illustrious-site"
      }
    }

    template {
      metadata {
        labels = {
          app = "illustrious-site"
        }
      }

      spec {
        container {
          name  = "illustrious-site"
          image = "registry.digitalocean.com/illustrious-online/illustrious-site:latest"
          port {
            container_port = 3000
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "illustrious_site_service" {
  metadata {
    name = "illustrious-site-service"
  }

  spec {
    selector = {
      app = "illustrious-site"
    }

    port {
      port        = 80
      target_port = 3000
    }
    type = "ClusterIP"
  }
}

resource "kubernetes_ingress" "illustrious_site_ingress" {
  metadata {
    name = "illustrious-site-ingress"
    annotations = {
      "nginx.ingress.kubernetes.io/rewrite-target" = "/"
    }
  }

  spec {
    rule {
      host = "ill.ustrio.us"
      http {
        path {
          path = "/"
          backend {
            service_name = "illustrious-site-service"
            service_port = 80
          }
        }
      }
    }
  }
}