output "db_instance_endpoint" {
  description = "Connection endpoint for RDS instance"
  value       = aws_db_instance.main.endpoint
}

output "db_instance_address" {
  description = "Address host of RDS instance"
  value       = aws_db_instance.main.address
}

output "db_instance_port" {
  description = "Port of RDS instance"
  value       = aws_db_instance.main.port
}

output "db_instance_id" {
  description = "ID of RDS instance"
  value       = aws_db_instance.main.id
}
