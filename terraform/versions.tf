terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "rug-pull-detector-tf-state"
    key            = "detection-api/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "rug-pull-detector-tf-locks"
    encrypt        = true
  }
}
