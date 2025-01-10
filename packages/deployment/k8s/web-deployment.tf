resource "kubernetes_deployment" "illustrious_web_deployment" {
  metadata {
    name = "ill-site"
  }

  spec {
    selector {
      match_labels = {
        app = "ill-site"
      }
    }

    template {
      metadata {
        labels = {
          app = "ill-site"
        }
      }

      spec {
        container {
          name  = "ill-site"
          image = "registry.digitalocean.com/illustrious-online/ill-web:latest"
          port {
            container_port = 3000
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "illustrious_web_service" {
  metadata {
    name = "ill-site-service"
  }

  spec {
    selector = {
      app = "ill-site"
    }

    port {
      port        = 80
      target_port = 3000
    }
    type = "ClusterIP"
  }
}

resource "kubernetes_ingress" "illustrious_web_ingress" {
  metadata {
    name = "ill-site-ingress"
    annotations = {
      "nginx.ingress.kubernetes.io/rewrite-target" = "/"
    }
  }

  spec {
    rule {
      host = "illustrious.online"
      http {
        path {
          path = "/"
          backend {
            service_name = "ill-site-service"
            service_port = 80
          }
        }
      }
    }
  }
}