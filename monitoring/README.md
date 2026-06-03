kubectl apply -f monitoring/namespace.yaml

helm repo add prometheus-community \
https://prometheus-community.github.io/helm-charts

helm repo update

helm install monitoring \
prometheus-community/kube-prometheus-stack \
-n monitoring \
-f monitoring/prometheus-values.yaml

kubectl apply -f monitoring/servicemonitor.yaml




Access Grafana
kubectl port-forward svc/monitoring-grafana 3000:80 -n monitoring

Open:

http://localhost:3000
Access Prometheus
kubectl port-forward svc/monitoring-kube-prometheus-prometheus 9090:9090 -n monitoring

Open:

http://localhost:9090