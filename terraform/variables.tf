variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "AWS CLI profile for single main account IAM authentication"
  type        = string
  default     = "alafiz"
}

variable "environment" {
  description = "Deployment environment name (e.g. dev, staging, prod)"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "app_name" {
  description = "Application name prefix for infrastructure resources"
  type        = string
  default     = "detection-api"
}

variable "container_image" {
  description = "Docker image for the detection API ECS task"
  type        = string
  default     = "nginx:latest"
}

variable "container_port" {
  description = "Port exposed by the detection API container"
  type        = number
  default     = 8080
}

variable "db_name" {
  description = "Database name for RDS instance"
  type        = string
  default     = "rugpulldb"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "dbadmin"
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
  default     = "ChangeMeInProduction123!"
}

variable "db_allocated_storage" {
  description = "Allocated storage size in GB for RDS instance"
  type        = number
  default     = 20
}

variable "db_instance_class" {
  description = "RDS DB instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "ecs_task_cpu" {
  description = "CPU units for ECS Fargate task (256 = 0.25 vCPU)"
  type        = number
  default     = 256
}

variable "ecs_task_memory" {
  description = "Memory (in MB) for ECS Fargate task"
  type        = number
  default     = 512
}

variable "ecs_desired_count" {
  description = "Desired number of container instances in ECS service"
  type        = number
  default     = 2
}
