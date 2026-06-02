resource "aws_subnet" "public" {
  for_each = {
    for idx, subnet in var.public_subnets :
    idx => subnet
  }

  vpc_id                  = module.vpc.vpc_id
  cidr_block              = each.value
  availability_zone       = var.availability_zones[each.key]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-${each.key}"

    "kubernetes.io/role/elb" = "1"
  }
}

resource "aws_subnet" "private" {
  for_each = {
    for idx, subnet in var.private_subnets :
    idx => subnet
  }

  vpc_id            = module.vpc.vpc_id
  cidr_block        = each.value
  availability_zone = var.availability_zones[each.key]

  tags = {
    Name = "${var.project_name}-private-${each.key}"

    "kubernetes.io/role/internal-elb" = "1"
  }
}