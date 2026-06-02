resource "aws_ecr_repository" "app" {
  name = "${var.project_name}-app"

  image_scanning_configuration {
    scan_on_push = true
  }

  force_delete = false

  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "bablu"
  }
}