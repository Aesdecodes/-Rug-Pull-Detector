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
  description = "VPC ID where ECS service runs"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "Private Subnet IDs for ECS tasks"
}

variable "container_image" {
  type        = string
  description = "Docker container image"
}

variable "container_port" {
  type        = number
  description = "Port exposed by container"
}

variable "cpu" {
  type        = number
  description = "Task CPU allocation"
}

variable "memory" {
  type        = number
  description = "Task memory allocation"
}

variable "desired_count" {
  type        = number
  description = "Desired count of running ECS tasks"
}
