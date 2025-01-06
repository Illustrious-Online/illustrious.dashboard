resource "kubernetes_deployment" "nginx_ingress_controller" {
  metadata {
    name = "nginx-ingress-controller"
    labels = {
      app = "nginx-ingress"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "nginx-ingress"
      }
    }

    template {
      metadata {
        labels = {
          app = "nginx-ingress"
        }
      }

      spec {
        container {
          name  = "nginx-ingress-controller"
          image = "k8s.gcr.io/ingress-nginx/controller:v1.2.0"  # NGINX Ingress Controller image

          port {
            container_port = 80
            name           = "http"
          }

          port {
            container_port = 443
            name           = "https"
          }

          args = [
            "/nginx-ingress-controller",
            "--configmap=$(POD_NAMESPACE)/nginx-configuration",
            "--tcp-services-configmap=$(POD_NAMESPACE)/tcp-services",
            "--udp-services-configmap=$(POD_NAMESPACE)/udp-services"
          ]
        }
      }
    }
  }
}
