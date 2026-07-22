variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR block"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "Public subnet CIDRs"
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "Private subnet CIDRs"
}

variable "environment" {
  type        = string
  description = "Environment name"
}

variable "app_name" {
  type        = string
  description = "Application name"
}
