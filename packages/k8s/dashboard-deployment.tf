resource "kubernetes_deployment" "ill_dashboard" {
  metadata {
    name = "ill-dashboard"
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "ill-dashboard"
      }
    }

    template {
      metadata {
        labels = {
          app = "ill-dashboard"
        }
      }

      spec {
        container {
          name  = "ill-dashboard"
          image = "registry.digitalocean.com/illustrious-online/ill-dashboard:latest"
          port {
            container_port = 3000
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "ill_dashboard_service" {
  metadata {
    name = "ill-dashboard-service"
  }

  spec {
    selector = {
      app = "ill-dashboard"
    }

    port {
      port        = 80
      target_port = 3000
    }
    type = "LoadBalancer"
  }
}

resource "kubernetes_ingress" "ill_dashboard_ingress" {
  metadata {
    name = "ill-dashboard-ingress"
    annotations = {
      "nginx.ingress.kubernetes.io/rewrite-target" = "/"
    }
  }

  spec {
    rule {
      host = "dashboard.illustrious.online"
      http {
        path {
          path = "/"
          backend {
            service_name = "ill-dashboard-service"
            service_port = 80
          }
        }
      }
    }
  }
}