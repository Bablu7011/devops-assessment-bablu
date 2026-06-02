variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_cidr" {
  type = string
}




variable "availability_zones" {
  type = list(string)

  default = [
    "ap-south-1a",
    "ap-south-1b"
  ]
}

variable "public_subnets" {
  type = list(string)
}

variable "private_subnets" {
  type = list(string)
}