variable "region" {
  default = "ap-south-1"
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
