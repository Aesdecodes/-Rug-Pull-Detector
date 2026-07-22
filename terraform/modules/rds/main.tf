resource "aws_db_subnet_group" "main" {
  name        = "${var.app_name}-${var.environment}-db-subnet-group"
  subnet_ids  = var.private_subnet_ids
  description = "DB subnet group for ${var.app_name}"

  tags = {
    Name        = "${var.app_name}-${var.environment}-db-subnet-group"
    Environment = var.environment
  }
}

resource "aws_security_group" "rds" {
  name        = "${var.app_name}-${var.environment}-rds-sg"
  description = "Security group for RDS PostgreSQL instance"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow inbound database connections from ECS tasks"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.ecs_security_group_id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.app_name}-${var.environment}-rds-sg"
    Environment = var.environment
  }
}

resource "aws_db_parameter_group" "main" {
  name   = "${var.app_name}-${var.environment}-pg15-params"
  family = "postgres15"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  tags = {
    Environment = var.environment
  }
}

resource "aws_db_instance" "main" {
  identifier            = "${var.app_name}-${var.environment}-db"
  engine                = "postgres"
  engine_version        = "15.7"
  instance_class        = var.instance_class
  allocated_storage     = var.allocated_storage
  max_allocated_storage = 100
  storage_type          = "gp3"

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  parameter_group_name   = aws_db_parameter_group.main.name

  multi_az            = var.multi_az
  publicly_accessible = false
  skip_final_snapshot = true
  deletion_protection = false

  tags = {
    Name        = "${var.app_name}-${var.environment}-db"
    Environment = var.environment
  }
}
