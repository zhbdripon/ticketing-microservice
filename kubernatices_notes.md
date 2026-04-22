# Kubernetes Notes

## Overview

Kubernetes is a tool to run a bunch of different containers.

### Kubernetes Cluster

- Can have multiple **nodes** (virtual machines)
- Has a **master** that controls everything in the cluster
- Has its own config file
- Each node generally runs one container
- Allows communication between nodes and from outside

```
        Kubernetes Cluster
┌─────────────────────────────────┐
│  node 1      node 2      node 3 │
│  pod         pod         pod    │
├─────────────────────────────────┤
│            service              │
├──────────────┬──────────────────┤
│    master    │   Deployment     │
└──────────────┴──────────────────┘
```

- Each node runs one or more **pods**. A pod is a wrapper over a container.
- To manage communication between pods we have a **service** layer.
- A **deployment** manages pods — it creates a new one if one crashes.

---

## Terminology

| Term | Description |
|------|-------------|
| **Cluster** | A collection of nodes + a master to manage them |
| **Node** | A virtual machine |
| **Pod** | Runs a container. A pod can run multiple containers, but typically we don't do that |
| **Deployment** | Monitors a set of pods; restarts/runs them if they crash |
| **Service** | Provides an easy-to-remember URL to communicate with pods and abstracts wiring complexity |

---

## Pods

### Sample Pod Config (`nginx.yml`)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  labels:
    app: my-pod # Optional labels for grouping and selection. required for services and deployments.
spec:
  containers:
  - name: my-container
    image: nginx:latest
    imagePullPolicy: Never # Optional: Don't pull the image if it already exists locally (useful for local development) otherwise it defaults to "IfNotPresent"
```

> `nginx:latest` is the image of the container to run. You can use any image from Docker Hub, or create your own and push it.

### Create & verify a Pod

```bash
kubectl apply -f nginx.yml
kubectl get pods
```

### Common Pod Commands

| Command | Description |
|---------|-------------|
| `kubectl get pods` | List all pods |
| `kubectl logs <podName>` | View pod logs |
| `kubectl describe pod <podName>` | Get pod details |
| `kubectl delete pod <podName>` | Delete a pod |
| `kubectl exec -it <podName> -- <command>` | Execute a command inside a pod |

---

## Deployments

A deployment is a higher-level abstraction that manages a set of pods. It ensures the desired number of pods are running at all times. If a pod crashes, the deployment automatically creates a new one.

> Generally, create a **Deployment** instead of pods directly — it provides better management and scalability.

### Sample Deployment Config (`nginx-deployment.yml`)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
```

> `replicas: 3` means 3 pods of nginx will run. The `selector` and `template` sections define labels for pods and how to match them with the deployment.

### Common Deployment Commands

| Command | Description |
|---------|-------------|
| `kubectl apply -f nginx-deployment.yml` | Create a deployment |
| `kubectl get deployments` | List all deployments |
| `kubectl describe deployment <name>` | Get deployment details |
| `kubectl delete deployment <name>` | Delete a deployment |
| `kubectl scale deployment <name> --replicas=<n>` | Scale a deployment |
| `kubectl rollout restart deployment <name>` | Restart a deployment |

---

## Services

A service is an abstraction that defines a logical set of pods and a policy to access them. It provides a stable IP address and DNS name for the pods it manages, and can load balance traffic.

### Service Types

| Type | Description |
|------|-------------|
| **ClusterIP** | Exposes the service on a cluster-internal IP. Only reachable from within the cluster. |
| **NodePort** | Exposes the service on each node's IP at a static port. Mostly used for development and testing. |
| **LoadBalancer** | Exposes the service externally using a cloud provider's load balancer. Used in production. |
| **ExternalName** | Maps the service to an external DNS name via a CNAME record. Used to access services outside the cluster. |

### Common Service Commands

| Command | Description |
|---------|-------------|
| `kubectl apply -f service.yml` | Create a service |
| `kubectl get services` | List all services |
| `kubectl describe service <name>` | Get service details |
| `kubectl delete service <name>` | Delete a service |

---

## NodePort Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app: my-app
  ports:
    - name: my-port
      protocol: TCP
      port: 80
      targetPort: 80
      nodePort: 30007
```

| Field | Description |
|-------|-------------|
| `targetPort` | The container port to expose |
| `port` | The port the service listens on |
| `nodePort` | The port exposed on each node (range: `30000`–`32767`) |

> Access from outside: `<NodeIP>:<NodePort>` — e.g., `192.168.1.100:30007`

---

## ClusterIP Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
    - name: my-port
      protocol: TCP
      port: 80
      targetPort: 80
```

> Only accessible from within the cluster. Access via service name and port — e.g., `my-service:80`.

---

## LoadBalancer Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - name: my-port
      protocol: TCP
      port: 80
      targetPort: 80
```

> The cloud provider provisions a load balancer and routes traffic to the automatically created NodePort and ClusterIP services. Access via the external IP provided by the cloud provider.

---

## Ingress Controller

An Ingress Controller is a pod with a set of routing rules to distribute traffic to different services. It provides:

- SSL termination
- Path-based routing
- Host-based routing

**ingress-nginx** is a popular ingress controller. Deploying it creates a load balancer service + an ingress resource.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.13.3/deploy/static/provider/cloud/deploy.yaml
```
