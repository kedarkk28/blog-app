# 📰 BlogSphere

A full-stack blog application with categories, cover images, and a beautiful dark UI — deployable on a local Kubernetes cluster.

---

## 🗂 Project Structure

```
blog-app/
├── frontend/           # React 18 + Vite + React Router
│   ├── src/
│   │   ├── components/ # Navbar, BlogCard, CategoryCard
│   │   └── pages/      # Home, CreateBlog, CategoryPage, BlogDetail
│   ├── Dockerfile
│   └── nginx.conf
├── backend/            # Node.js + Express + Mongoose
│   ├── models/Blog.js
│   ├── server.js
│   └── Dockerfile
├── k8s/                # Kubernetes manifests
│   ├── namespace.yaml
│   ├── mongodb-pvc.yaml
│   ├── mongodb-deployment.yaml
│   ├── mongodb-service.yaml
│   ├── backend-configmap.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── backend-hpa.yaml
│   └── ingress.yaml
└── deploy.sh           # One-command deploy script
```

---

## 🚀 Quick Deploy (Minikube)

```bash
# 1. Make deploy script executable
chmod +x deploy.sh

# 2. Run it
./deploy.sh

# 3. Open app
# NodePort:   http://$(minikube ip):30080
# OR
minikube service blog-frontend -n blog-app
```

---

## 🛠 Manual Deploy

### Step 1 — Build Docker images

```bash
# Point Docker to minikube's registry
eval $(minikube docker-env)

docker build -t blog-backend:latest  ./backend
docker build -t blog-frontend:latest ./frontend
```

### Step 2 — Apply manifests

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongodb-pvc.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml
kubectl apply -f k8s/backend-configmap.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/backend-hpa.yaml
kubectl apply -f k8s/ingress.yaml      # optional
```

### Step 3 — Check pod status

```bash
kubectl get pods -n blog-app
kubectl get svc  -n blog-app
```

---

## 🌐 Accessing the App

| Method | URL |
|--------|-----|
| NodePort | `http://$(minikube ip):30080` |
| Ingress | `http://blog.local` (requires nginx ingress + /etc/hosts entry) |
| Minikube tunnel | `minikube service blog-frontend -n blog-app` |

### Set up Ingress (optional)

```bash
# Install nginx ingress addon in minikube
minikube addons enable ingress

# Add to /etc/hosts
echo "$(minikube ip) blog.local" | sudo tee -a /etc/hosts

# Then visit http://blog.local
```

---

## 💻 Local Development (without K8s)

### Backend

```bash
cd backend
npm install
# create .env with: MONGO_URI=mongodb://localhost:27017/blogdb
npm run dev        # runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # runs on http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/blogs` | List all blogs (`?category=Food&limit=7`) |
| GET | `/api/blogs/:id` | Get single blog |
| GET | `/api/image/:id` | Get blog cover image |
| POST | `/api/blogs` | Create blog (multipart/form-data) |
| DELETE | `/api/blogs/:id` | Delete blog |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express 4, Multer |
| Database | MongoDB 7 (images stored as BSON binary) |
| Container | Docker (multi-stage build for frontend) |
| Web server | Nginx (reverse proxy + SPA routing) |
| Orchestration | Kubernetes (Deployment, Service, PVC, HPA, Ingress) |

---

## 🧹 Teardown

```bash
kubectl delete namespace blog-app
```

This removes all resources including the MongoDB PVC.