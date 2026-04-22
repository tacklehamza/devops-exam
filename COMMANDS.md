# DevOps Exam - FA23-BCS-214 - All Commands

## PART 1: Docker

### 1. Verify Docker installation
```bash
docker --version
docker info
```

### 2. Build Docker image (tag = reg no.)
```bash
docker build -t fa23-bcs-214 .
```

### 3. Run container locally
```bash
docker run -d -p 3000:3000 --name taskmanager fa23-bcs-214
```
Open browser: http://localhost:3000
Test API:     http://localhost:3000/api/health

### 4. Tag image for Docker Hub
```bash
docker tag fa23-bcs-214 tacklewithhamza/fa23-bcs-214:latest
```

### 5. Push to Docker Hub
```bash
docker login
docker push tacklewithhamza/fa23-bcs-214:latest
```

### Docker Optimizations Applied:
- node:18-alpine base image (reduces size from ~900MB to ~180MB)
- package.json copied first to cache dependency layer
- .dockerignore excludes node_modules, .env, .git
- --omit=dev installs only production dependencies

---

## PART 2: Git & GitHub

### 1. Initialize and connect repo
```bash
git init
git remote add origin https://github.com/tacklewithhamza/devops-exam.git
```

### 2. First commit - push all files
```bash
git add .
git commit -m "Initial commit: Add full-stack app with Dockerfile and K8s configs"
git branch -M main
git push -u origin main
```

### 3. Pull latest changes
```bash
git pull origin main
```

### 4. Make a small fix then second commit
# (Edit frontend/index.html - e.g. change title or add a line)
```bash
git add .
git commit -m "Fix: Update UI title and improve status bar message"
git push origin main
```

### 5. View commit history
```bash
git log --oneline
```

---

## PART 3: Azure + Kubernetes

### 1. Install Azure CLI and login
```bash
az login
az group create --name devops-rg --location eastus
```

### 2. Create AKS cluster
```bash
az aks create \
  --resource-group devops-rg \
  --name devops-cluster \
  --node-count 1 \
  --enable-addons monitoring \
  --generate-ssh-keys
```

### 3. Connect kubectl to AKS
```bash
az aks get-credentials --resource-group devops-rg --name devops-cluster
kubectl get nodes
```

### 4. Deploy to Kubernetes
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### 5. Check pods and services
```bash
kubectl get pods
kubectl get services
```

### 6. Get public IP (wait 1-2 mins for EXTERNAL-IP)
```bash
kubectl get service taskmanager-service
```
Access app at: http://<EXTERNAL-IP>

### 7. Scale replicas (troubleshooting/scaling demo)
```bash
# Scale up to 3 replicas
kubectl scale deployment taskmanager-deployment --replicas=3
kubectl get pods

# Scale back down
kubectl scale deployment taskmanager-deployment --replicas=2
kubectl get pods
```

---

## PART 4: Troubleshooting Example

### Issue: Wrong container port mapping
**Symptom:** App not accessible at http://localhost:3000

**Diagnosis:**
```bash
docker ps   # check port mapping
docker logs taskmanager
```

**Root Cause:** Container was run with wrong port flag:
```bash
# WRONG (missing port mapping)
docker run -d fa23-bcs-214

# FIXED
docker run -d -p 3000:3000 --name taskmanager fa23-bcs-214
```

**Result:** App accessible at http://localhost:3000 after fix.
