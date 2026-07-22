provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile

  default_tags {
    tags = {
      Project     = "Rug-Pull-Detector"
      ManagedBy   = "Terraform"
      Environment = var.environment
    }
  }
}
