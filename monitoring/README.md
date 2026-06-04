# Monitoring Stack (Prometheus + Grafana)

This Section implements Kubernetes and application monitoring using:

```text
Application Metrics
        ↓
Prometheus
        ↓
Grafana
```

## Components Used

### Prometheus

* Collects metrics from Kubernetes and applications
* Stores time-series data
* Provides powerful querying using PromQL

### Grafana

* Visualizes metrics collected by Prometheus
* Creates dashboards for monitoring infrastructure and applications
* Provides real-time insights into system health

### ServiceMonitor

* Custom Resource Definition (CRD) used by Prometheus Operator
* Automatically discovers application metrics endpoints
* Enables Prometheus to scrape application metrics

---

# Step 1: Create Monitoring Namespace

Create a dedicated namespace for monitoring resources.

```bash
kubectl apply -f monitoring/namespace.yaml
```

Verify:

```bash
kubectl get ns
```

Expected:

```text
monitoring
```

---

# Step 2: Add Prometheus Helm Repository

```bash
helm repo add prometheus-community \
https://prometheus-community.github.io/helm-charts

helm repo update
```

Verify available charts:

```bash
helm search repo prometheus-community
```

---

# Step 3: Install Prometheus & Grafana

Deploy the complete monitoring stack using kube-prometheus-stack.

```bash
helm install monitoring \
prometheus-community/kube-prometheus-stack \
-n monitoring \
-f monitoring/prometheus-values.yaml
```

This installation includes:

* Prometheus
* Grafana
* Alertmanager
* Node Exporter
* kube-state-metrics
* Prometheus Operator

---

# Step 4: Configure Application Monitoring

Apply ServiceMonitor configuration.

```bash
kubectl apply -f monitoring/servicemonitor.yaml
```

### Purpose

The ServiceMonitor allows Prometheus to scrape metrics exposed by the backend application through:

```text
/metrics
```

Example Metrics:

```text
http_requests_total
http_request_duration_seconds
process_cpu_seconds_total
process_resident_memory_bytes
```

---

# Verify Monitoring Components

## Check Pods

```bash
kubectl get pods -n monitoring
```

Expected Components:

```text
monitoring-grafana
monitoring-kube-prometheus-prometheus
monitoring-kube-state-metrics
monitoring-alertmanager
monitoring-prometheus-node-exporter
```

---

## Check Services

```bash
kubectl get svc -n monitoring
```

---

# Access Grafana

Port Forward Grafana Service:

```bash
kubectl port-forward svc/monitoring-grafana \
3000:80 \
-n monitoring
```

Open:

```text
http://localhost:3000
```

### Grafana Dashboards

Implemented Dashboards:

* Kubernetes Cluster Dashboard
* Node Resource Dashboard
* Pod Resource Dashboard
* API Request Count Dashboard
* API Latency Dashboard

Metrics Visualized:

* CPU Usage
* Memory Usage
* Node Health
* Pod Health
* Request Count
* Response Time

---

# Access Prometheus

Port Forward Prometheus Service:

```bash
kubectl port-forward \
svc/monitoring-kube-prometheus-prometheus \
9090:9090 \
-n monitoring
```

Open:

```text
http://localhost:9090
```

### Prometheus Usage

Used for:

* Viewing scraped targets
* Running PromQL queries
* Validating application metrics
* Troubleshooting monitoring issues

Example Queries:

```promql
sum(http_requests_total)
```

```promql
process_resident_memory_bytes
```

```promql
rate(http_request_duration_seconds_sum[5m])
/
rate(http_request_duration_seconds_count[5m])
```

---

# Monitoring Flow

```text
Backend Application
        ↓
/metrics Endpoint
        ↓
ServiceMonitor
        ↓
Prometheus
        ↓
Grafana
```

---
