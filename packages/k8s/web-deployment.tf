resource "kubernetes_deployment" "illustrious_web" {
  metadata {
    name = "illustrious-web"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "illustrious-web"
      }
    }

    template {
      metadata {
        labels = {
          app = "illustrious-web"
        }
      }

      spec {
        container {
          name  = "illustrious-web"
          image = "registry.digitalocean.com/illustrious-online/illustrious-web:latest"
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
    name = "illustrious-web-service"
  }

  spec {
    selector = {
      app = "illustrious-web"
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
    name = "illustrious-web-ingress"
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
            service_name = "illustrious-web-service"
            service_port = 80
          }
        }
      }
    }
  }
}