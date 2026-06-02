module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "${var.project_name}-${var.environment}"
  cluster_version = "1.33"

  vpc_id = module.vpc.vpc_id

  subnet_ids = values(aws_subnet.private)[*].id

  cluster_endpoint_public_access = true
  enable_cluster_creator_admin_permissions = true

  eks_managed_node_groups = {
    default = {
      instance_types = ["t3.medium"]

      min_size     = 2
      max_size     = 3
      desired_size = 2

      subnet_ids = values(aws_subnet.private)[*].id


    }
  }

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}
