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
        GIT_REPO_URL = "https://github.com/kedarkk28/blog-app.git"
    }
    stages {

        stage('Checkout git'){
            steps{
            echo "Checking out git"
            //git url: "${GIT_REPO_URL}", branch: 'main'
        }
        }

        stage('Build Docker image'){
            steps{
                dir('frontend') {
                echo "docker images"
                sh "docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ."
}
               dir('backend') {
                echo "docker images"
                sh "docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ."
}
            sh "docker images grep ${IMAGE_TAG}"
            }
        }
    }
}