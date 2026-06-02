module "vpc" {
  source = "clouddrove/vpc/aws"

  name        = var.project_name
  environment = var.environment

  cidr_block = var.vpc_cidr

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}