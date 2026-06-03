# Logging Stack (ELK + Fluent Bit)

This Section implements centralized logging using:

```text
Application Logs
      ↓
Fluent Bit
      ↓
Elasticsearch
      ↓
Kibana
```

## Components Used

### Fluent Bit

* Lightweight log collector for Kubernetes
* Collects logs from application pods
* Forwards logs to Elasticsearch

### Elasticsearch

* Centralized log storage
* Indexes logs for fast searching and filtering

### Kibana

* Visualization and log analysis dashboard
* Used to search, filter, and analyze logs

---

# Step 1: Install Elasticsearch

## Add Elastic Helm Repository

```bash
helm repo add elastic https://helm.elastic.co

helm repo update

helm search repo elastic
```

## Install Elasticsearch

```bash
helm install elasticsearch elastic/elasticsearch \
-n logging \
--set replicas=1 \
--set persistence.enabled=false \
--set resources.requests.memory=512Mi \
--set resources.limits.memory=1Gi
```

### Explanation

| Configuration             | Purpose                                         |
| ------------------------- | ----------------------------------------------- |
| replicas=1                | Single-node deployment for assessment           |
| persistence.enabled=false | Disable persistent storage to reduce complexity |
| requests.memory=512Mi     | Minimum memory requested                        |
| limits.memory=1Gi         | Maximum memory allowed                          |

---

## Verify Elasticsearch

```bash
kubectl get svc -n logging
```

Expected Service:

```text
elasticsearch-master
```

### Access Elasticsearch

```bash
kubectl port-forward svc/elasticsearch-master \
9200:9200 \
-n logging
```

Verify:

```bash
curl http://localhost:9200
```

---

# Step 2: Install Kibana

## Install Kibana

```bash
helm install kibana elastic/kibana \
-n logging \
--set elasticsearchHosts="https://elasticsearch-master:9200"
```

## Verify Kibana

```bash
kubectl get svc -n logging
```

Expected Service:

```text
kibana-kibana
```

### Access Kibana

```bash
kubectl port-forward svc/kibana-kibana \
5601:5601 \
-n logging
```

Open:

```text
http://localhost:5601
```

---

# Step 3: Install Fluent Bit

## Add Fluent Bit Helm Repository

```bash
helm repo add fluent https://fluent.github.io/helm-charts

helm repo update
```

## Install Fluent Bit

```bash
helm install fluent-bit fluent/fluent-bit \
-n logging \
-f logging/fluentbit-values.yaml
```

### Purpose

Fluent Bit runs as a DaemonSet and:

* Collects logs from Kubernetes Pods
* Enriches logs with Kubernetes metadata
* Sends logs to Elasticsearch

---

# Logging Flow Verification

## Check Fluent Bit Pods

```bash
kubectl get pods -n logging
```

## Check Elasticsearch Indices

```bash
curl localhost:9200/_cat/indices?v
```

## Verify Logs in Kibana

1. Open Kibana Dashboard
2. Navigate to Discover
3. Select the created Data View
4. Search and filter application logs

---



