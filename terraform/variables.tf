variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "aws_access_key" {
  type      = string
  sensitive = true
}

variable "aws_secret_key" {
  type      = string
  sensitive = true
}


variable "profile" {
  default = "default"
}

variable "cluster_name" {
  default = "nextjs-eks-cluster"
}

variable "node_instance_type" {
  default = "t3.medium"
}

variable "desired_capacity" {
  default = 2
}
