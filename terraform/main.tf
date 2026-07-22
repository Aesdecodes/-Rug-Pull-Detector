module "vpc" {
  source               = "./modules/vpc"
  app_name             = var.app_name
  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
}

module "ecs" {
  source             = "./modules/ecs"
  app_name           = var.app_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  container_image    = var.container_image
  container_port     = var.container_port
  cpu                = var.ecs_task_cpu
  memory             = var.ecs_task_memory
  desired_count      = var.ecs_desired_count
}

module "rds" {
  source                = "./modules/rds"
  app_name              = var.app_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  ecs_security_group_id = module.ecs.ecs_security_group_id
  db_name               = var.db_name
  db_username           = var.db_username
  db_password           = var.db_password
  allocated_storage     = var.db_allocated_storage
  instance_class        = var.db_instance_class
  multi_az              = true
}
