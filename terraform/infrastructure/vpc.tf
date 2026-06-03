module "vpc" {

  # due to error in this vpc moodule of name in data.aws_region.current.region Replace with: data.aws_region.current.name 
  #There are typically 2 occurrences around lines 478 and 494.
  # so i am doing this for cicd workflow to work properly. I have tested this change in my local and it is working fine. Please let me know if you have any questions or concerns.


  source = "./modules/vpc"

  name        = var.project_name
  environment = var.environment

  cidr_block = var.vpc_cidr

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}