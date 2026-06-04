########################################
# VPC
########################################

resource "aws_vpc" "this" {

  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = var.name
  }
}

########################################
# INTERNET GATEWAY
########################################

resource "aws_internet_gateway" "this" {

  vpc_id = aws_vpc.this.id

  tags = {
    Name = "${var.name}-igw"
  }
}

########################################
# PUBLIC SUBNETS
########################################

resource "aws_subnet" "public" {

  count = length(var.public_subnets)

  vpc_id                  = aws_vpc.this.id
  cidr_block              = var.public_subnets[count.index]
  availability_zone       = var.azs[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.name}-public-${count.index + 1}"

    "kubernetes.io/role/elb" = "1"
  }
}

########################################
# PRIVATE SUBNETS
########################################

resource "aws_subnet" "private" {

  count = length(var.private_subnets)

  vpc_id            = aws_vpc.this.id
  cidr_block        = var.private_subnets[count.index]
  availability_zone = var.azs[count.index]

  tags = {
    Name = "${var.name}-private-${count.index + 1}"

    "kubernetes.io/role/internal-elb" = "1"
  }
}

########################################
# ELASTIC IP
########################################

resource "aws_eip" "nat" {

  domain = "vpc"

  tags = {
    Name = "${var.name}-nat-eip"
  }

  depends_on = [
    aws_internet_gateway.this
  ]
}

########################################
# NAT GATEWAY
########################################

resource "aws_nat_gateway" "this" {

  allocation_id = aws_eip.nat.id

  subnet_id = aws_subnet.public[0].id

  tags = {
    Name = "${var.name}-nat-gateway"
  }

  depends_on = [
    aws_internet_gateway.this
  ]
}

########################################
# PUBLIC ROUTE TABLE
########################################

resource "aws_route_table" "public" {

  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"

    gateway_id = aws_internet_gateway.this.id
  }

  tags = {
    Name = "${var.name}-public-rt"
  }
}

########################################
# PRIVATE ROUTE TABLE
########################################

resource "aws_route_table" "private" {

  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"

    nat_gateway_id = aws_nat_gateway.this.id
  }

  tags = {
    Name = "${var.name}-private-rt"
  }
}

########################################
# PUBLIC ROUTE ASSOCIATIONS
########################################

resource "aws_route_table_association" "public" {

  count = length(aws_subnet.public)

  subnet_id = aws_subnet.public[count.index].id

  route_table_id = aws_route_table.public.id
}

########################################
# PRIVATE ROUTE ASSOCIATIONS
########################################

resource "aws_route_table_association" "private" {

  count = length(aws_subnet.private)

  subnet_id = aws_subnet.private[count.index].id

  route_table_id = aws_route_table.private.id
}

