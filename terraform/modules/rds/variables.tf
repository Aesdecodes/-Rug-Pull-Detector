variable "app_name" {
  type        = string
  description = "Application name"
}

variable "environment" {
  type        = string
  description = "Environment name"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID where RDS is deployed"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "Private Subnet IDs for RDS subnet group"
}

variable "ecs_security_group_id" {
  type        = string
  description = "Security group ID of ECS tasks allowed to connect to RDS"
}

variable "db_name" {
  type        = string
  description = "Database name"
}

variable "db_username" {
  type        = string
  description = "Database master username"
}

variable "db_password" {
  type        = string
  description = "Database master password"
  sensitive   = true
}

variable "allocated_storage" {
  type        = number
  description = "Allocated storage size (GB)"
}

variable "instance_class" {
  type        = string
  description = "RDS instance class"
}

variable "multi_az" {
  type        = bool
  default     = true
  description = "Enable Multi-AZ for high availability"
}
