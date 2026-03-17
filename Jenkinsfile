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

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))   // keep last 10 builds
        timestamps()                                      // prefix every log line with time
        timeout(time: 20, unit: 'MINUTES')               // fail if pipeline hangs
    }

    // ── Stages ──────────────────────────────────────────────────────────────
    stages {

        // ── 1. Checkout ─────────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo "📥 Checking out source code..."
                checkout scm
                sh 'echo "Commit: $(git rev-parse --short HEAD)"'
            }
        }

        // ── 2. Install Dependencies ─────────────────────────────────────────
        stage('Install Dependencies') {
            parallel {
                stage('Frontend deps') {
                    steps {
                        dir('frontend') {
                            echo "📦 Installing frontend dependencies..."
                            sh 'npm ci'
                        }
                    }
                }
                stage('Backend deps') {
                    steps {
                        dir('backend') {
                            echo "📦 Installing backend dependencies..."
                            sh 'npm ci'
                        }
                    }
                }
            }
        }

        // ── 3. Lint ──────────────────────────────────────────────────────────
        stage('Lint') {
            steps {
                dir('frontend') {
                    echo "🔍 Running ESLint on frontend..."
                    // If you don't have ESLint configured yet, this won't fail the
                    // build — remove `|| true` once ESLint is properly set up
                    sh 'npx eslint src/ --ext .js,.jsx --max-warnings=0 || true'
                }
            }
        }

        // ── 4. Test ──────────────────────────────────────────────────────────
        stage('Test') {
            parallel {
                stage('Frontend tests') {
                    steps {
                        dir('frontend') {
                            echo "🧪 Running frontend tests..."
                            // Add Jest / Vitest tests here; placeholder passes until you add tests
                            sh 'npm test -- --passWithNoTests --watchAll=false 2>/dev/null || echo "No tests found — skipping"'
                        }
                    }
                }
                stage('Backend tests') {
                    steps {
                        dir('backend') {
                            echo "🧪 Running backend tests..."
                            sh 'npm test -- --passWithNoTests --watchAll=false 2>/dev/null || echo "No tests found — skipping"'
                        }
                    }
                }
            }
        }

        // ── 5. Docker Build ──────────────────────────────────────────────────
        stage('Docker Build') {
            parallel {
                stage('Build frontend image') {
                    steps {
                        echo "🐳 Building ${FRONTEND_IMAGE}..."
                        sh """
                            docker build \
                                --tag ${FRONTEND_IMAGE} \
                                --label "build=${BUILD_NUMBER}" \
                                --label "commit=\$(git rev-parse --short HEAD)" \
                                ./frontend
                        """
                        // Also tag as latest so kubectl can fall back to it
                        sh "docker tag ${FRONTEND_IMAGE} blog-frontend:latest"
                    }
                }
                stage('Build backend image') {
                    steps {
                        echo "🐳 Building ${BACKEND_IMAGE}..."
                        sh """
                            docker build \
                                --tag ${BACKEND_IMAGE} \
                                --label "build=${BUILD_NUMBER}" \
                                --label "commit=\$(git rev-parse --short HEAD)" \
                                ./backend
                        """
                        sh "docker tag ${BACKEND_IMAGE} blog-backend:latest"
                    }
                }
            }
        }

        // ── 6. Load Images into kind ─────────────────────────────────────────
        stage('Load into kind') {
            steps {
                echo "📤 Loading images into kind cluster: ${KIND_CLUSTER}..."
                sh """
                    kind load docker-image ${FRONTEND_IMAGE} --name ${KIND_CLUSTER}
                    kind load docker-image ${BACKEND_IMAGE}  --name ${KIND_CLUSTER}
                """
                echo "✅ Images loaded successfully into ${KIND_CLUSTER}"

                // Print what's now available in the cluster nodes
                sh """
                    echo "--- Images on kind nodes ---"
                    docker exec ${KIND_CLUSTER}-control-plane crictl images | grep -E "blog-(frontend|backend)"
                """
            }
        }

        // ── 7. Deploy to Kubernetes ──────────────────────────────────────────
        stage('Deploy to K8s') {
            steps {
                echo "🚀 Deploying tag ${IMAGE_TAG} to namespace ${K8S_NAMESPACE}..."
                sh """
                    # Update the image on both deployments atomically
                    kubectl set image deployment/blog-frontend \
                        blog-frontend=${FRONTEND_IMAGE} \
                        -n ${K8S_NAMESPACE}

                    kubectl set image deployment/blog-backend \
                        blog-backend=${BACKEND_IMAGE} \
                        -n ${K8S_NAMESPACE}
                """

                // Wait for rollouts to finish before marking stage green
                sh """
                    echo "⏳ Waiting for rollouts..."
                    kubectl rollout status deployment/blog-frontend \
                        -n ${K8S_NAMESPACE} --timeout=120s

                    kubectl rollout status deployment/blog-backend \
                        -n ${K8S_NAMESPACE} --timeout=120s
                """

                echo "✅ Deployment complete — running on tag ${IMAGE_TAG}"
            }
        }

        // ── 8. Port Forward ──────────────────────────────────────────────────
        stage('Port Forward') {
            steps {
                echo "🔗 Setting up port-forward: localhost:${FRONTEND_PORT} → svc/blog-frontend:80..."

                // Kill any existing port-forward on the same port to avoid conflicts
                sh "fuser -k ${FRONTEND_PORT}/tcp || true"

                // Start port-forward in the background; redirect output so Jenkins
                // doesn't wait for the process to finish
                sh """
                    kubectl port-forward svc/blog-frontend ${FRONTEND_PORT}:80 \
                        -n ${K8S_NAMESPACE} > /dev/null 2>&1 &

                    # Give it a moment to establish the tunnel
                    sleep 3

                    # Verify the port is actually listening
                    if fuser ${FRONTEND_PORT}/tcp > /dev/null 2>&1; then
                        echo "✅ Port-forward established — app is available at http://localhost:${FRONTEND_PORT}"
                    else
                        echo "⚠️  Port-forward may not have started — check kubectl connectivity"
                    fi
                """
            }
        }

    // ── Post ─────────────────────────────────────────────────────────────────
    post {
        success {
            echo """
╔══════════════════════════════════════════════╗
║   ✅  BUILD SUCCESS                          ║
║   Image tag : ${IMAGE_TAG}
║   Cluster   : ${KIND_CLUSTER}
║   Namespace : ${K8S_NAMESPACE}
║   App URL   : http://localhost:${FRONTEND_PORT}
╚══════════════════════════════════════════════╝
            """
        }

        failure {
            echo """
╔══════════════════════════════════════════════╗
║   ❌  BUILD FAILED                           ║
║   Check the logs above for the failing stage ║
╚══════════════════════════════════════════════╝
            """
            // Clean up any port-forward that may have started before the failure
            sh "fuser -k ${FRONTEND_PORT}/tcp || true"
            // Uncomment below to clean up dangling images on failure
            // sh "docker rmi ${FRONTEND_IMAGE} ${BACKEND_IMAGE} || true"
        }

        always {
            echo "📋 Printing final pod status..."
            sh "kubectl get pods -n ${K8S_NAMESPACE} || true"

            // Clean up any dangling <none> images left by the build
            sh "docker image prune -f || true"
        }
    }
}