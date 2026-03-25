# 🛡️ SOVEREIGN CLOUD OVERLORD (AWS)
# Modular Terraform for Elite Infrastructure

# 1. 🌐 SECURE VPC
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "sovereign-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
  enable_dns_hostnames = true

  public_subnet_tags = {
    "kubernetes.io/cluster/sovereign-eks" = "shared"
    "kubernetes.io/role/elb"              = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/cluster/sovereign-eks" = "shared"
    "kubernetes.io/role/internal-elb"     = "1"
  }
}

# 2. 🎡 EKS CLUSTER (Hardened Control Plane)
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.15.0"

  cluster_name    = "sovereign-eks"
  cluster_version = "1.27"

  vpc_id                         = module.vpc.vpc_id
  subnet_ids                     = module.vpc.private_subnets
  cluster_endpoint_public_access = true # Can be hardened to false with VPN

  eks_managed_node_groups = {
    sovereign_nodes = {
      min_size     = 2
      max_size     = 5
      desired_size = 3

      instance_types = ["t3.large"]
      capacity_type  = "ON_DEMAND"
      
      # 🛡️ NODE HARDENING
      key_name = "sovereign-key"
      block_device_mappings = {
        xvda = {
          device_name = "/dev/xvda"
          ebs = {
            volume_size           = 50
            volume_type           = "gp3"
            iops                  = 3000
            throughput            = 125
            encrypted             = true
            delete_on_termination = true
          }
        }
      }
    }
  }

  node_security_group_additional_rules = {
    ingress_self_all = {
      description = "Node to Node all ports/protocols"
      protocol    = "-1"
      from_port   = 0
      to_port     = 0
      type        = "ingress"
      self        = true
    }
  }
}

# 3. 🔐 KMS KEY (ENCRYPTION AT REST)
resource "aws_kms_key" "sovereign_key" {
  description             = "KMS Key for Sovereign Storage Encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}
