pipeline {
    agent any

    // ── Global variables ────────────────────────────────────────────────────
    environment {
        KIND_CLUSTER    = "k8s-multi-node-cluster"
        IMAGE_TAG       = "v${BUILD_NUMBER}"
        FRONTEND_IMAGE  = "blog-frontend:${IMAGE_TAG}"
        BACKEND_IMAGE   = "blog-backend:${IMAGE_TAG}"
        K8S_NAMESPACE   = "blog-app"
        FRONTEND_PORT   = "9094"
    }

    stages {
        stage('Checkout git'){
            echo "Checking out git"
        }
    }
}