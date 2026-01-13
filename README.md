# Microservices Project - Kubernetes Deployment

Просто приложение за управление на статии с три микросървиса: PostgreSQL база данни, Node.js/Express backend API и Next.js frontend.

## Структура на проекта

```
microservices-project/
├── backend/          # Node.js/Express API
├── frontend/         # Next.js приложение
└── k8s/             # Kubernetes манифести
```

## Етап 1: Build и Push на Docker Images

### 1. Регистрация в Docker Hub
Създайте профил в [Docker Hub](https://hub.docker.com/) и запишете вашето потребителско име.

### 2. Build на Backend Image

```bash
cd backend
docker build -t YOUR_DOCKERHUB_USERNAME/microservices-project-backend:v1 .
docker push YOUR_DOCKERHUB_USERNAME/microservices-project-backend:v1
```

### 3. Build на Frontend Image

```bash
cd frontend
docker build -t YOUR_DOCKERHUB_USERNAME/microservices-project-frontend:v1 .
docker push YOUR_DOCKERHUB_USERNAME/microservices-project-frontend:v1
```

**Важно:** Заменете `YOUR_DOCKERHUB_USERNAME` с вашето реално потребителско име във всички команди и в Kubernetes манифестите!

## Етап 2: Подготовка на Kubernetes

### Инсталиране на Minikube (ако не е инсталиран)

```bash
# macOS
brew install minikube

# Стартиране на Minikube
minikube start
```

### Проверка на клъстера

```bash
kubectl get nodes
```

## Етап 3: Деплоймънт в Kubernetes

### 1. Обновете Kubernetes манифестите

Преди да деплойнете, трябва да замените `YOUR_DOCKERHUB_USERNAME` в следните файлове:
- `k8s/backend-deployment.yaml`
- `k8s/frontend-deployment.yaml`

### 2. Деплоймънт на компонентите

```bash
cd k8s

# Database
kubectl apply -f database-secret.yaml
kubectl apply -f database-deployment.yaml
kubectl apply -f database-service.yaml

# Backend
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

# Frontend
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
```

### 3. Проверка на статуса

```bash
# Проверка на Pod-овете
kubectl get pods

# Проверка на Services
kubectl get services

# Проверка на Deployments
kubectl get deployments
```

### 4. Достъп до приложението

Frontend Service е конфигуриран като NodePort на порт 30080.

**С Minikube:**
```bash
minikube service frontend-service
```

Или отворете в браузър:
```
http://localhost:30080
```

**Ако използвате Docker Desktop Kubernetes:**
```
http://localhost:30080
```

## Скрийншоти за предаване

1. **Docker Hub профил** - снимка на качените images
2. **kubectl get pods** - снимка на работещите Pod-ове
3. **Работещо приложение** - снимка на приложението в браузър

## Локално тестване (без Kubernetes)

### Backend
```bash
cd backend
npm install
DB_HOST=localhost DB_PORT=5432 DB_NAME=articlesdb DB_USER=postgres DB_PASSWORD=postgres npm start
```

### Frontend
```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:3001 npm run dev
```

## Troubleshooting

### Проверка на логовете
```bash
kubectl logs <pod-name>
kubectl logs -f deployment/backend
kubectl logs -f deployment/frontend
kubectl logs -f deployment/database
```

### Описание на Pod
```bash
kubectl describe pod <pod-name>
```

### Премахване на ресурси
```bash
kubectl delete -f k8s/
```
