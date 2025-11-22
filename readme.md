1. Install or run kubernetes using docker
2. deploy the ingress controller using 
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.13.3/deploy/static/provider/cloud/deploy.yaml
3. Run all the yml using 
skaffold dev
4. set env
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
5. port forward to direct access pod
kubectl port-forward podName portNumber:portNumber
6. Port forward:
kubectl port-forward nats-depl-xxxxxxxx-xxxx  8222:8222
kubectl port-forward nats-depl-xxxxxxxx-xxxx  4222:4222