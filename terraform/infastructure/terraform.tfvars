project_name = "devops-assessment"

environment = "dev"

aws_region = "ap-south-1"

vpc_cidr = "10.0.0.0/16"

public_subnets = [
  "10.0.1.0/24",
  "10.0.2.0/24"
]

private_subnets = [
  "10.0.11.0/24",
  "10.0.12.0/24"
]

azs = [
  "ap-south-1a",
  "ap-south-1b"
]


cluster_name = "devops-assessment-dev"

cluster_version = "1.33"

node_instance_type = "t3.medium"

node_min_size     = 2
node_max_size     = 3
node_desired_size = 2