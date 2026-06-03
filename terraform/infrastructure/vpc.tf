module "vpc" {
  source = "./modules/vpc"

  name        = var.project_name
  environment = var.environment

  cidr_block = var.vpc_cidr

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}