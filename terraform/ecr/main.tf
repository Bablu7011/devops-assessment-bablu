module "ecr" {

  source  = "clouddrove/ecr/aws"
  version = "1.3.3"

  name        = var.repository_name
  environment = var.environment
}