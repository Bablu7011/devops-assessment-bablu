# elasticsearch

helm repo add elastic https://helm.elastic.co

helm repo update
helm search repo elastic

helm install elasticsearch elastic/elasticsearch \
-n logging \
--set replicas=1 \
--set persistence.enabled=false \
--set resources.requests.memory=512Mi \
--set resources.limits.memory=1Gi


kubectl get svc -n logging

kubectl port-forward svc/elasticsearch-master \
9200:9200 \
-n logging



# kibana


 helm install kibana elastic/kibana \
-n logging \
--set elasticsearchHosts="https://elasticsearch-master:9200"

kubectl get svc -n logging

kubectl port-forward svc/kibana-kibana \
5601:5601 \
-n logging



# fluent


helm repo add fluent https://fluent.github.io/helm-charts

helm repo update

helm install fluent-bit fluent/fluent-bit \
-n logging \
-f logging/fluentbit-values.yaml