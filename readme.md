1. Install or run kubernetes using docker
2. deploy the ingress controller using 
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.13.3/deploy/static/provider/cloud/deploy.yaml
3. Run all the yml using 
skaffold dev
4. set env
kubectl create secret generic jwt-secret --fro
m-literal=JWT_KEY=asdf
