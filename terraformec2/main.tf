provider "aws" {
  region = "us-east-1"
}

resource "tls_private_key" "terraform_key" {
  algorithm = "RSA"
}

resource "aws_key_pair" "terraform_key" {
  key_name   = "xcicd-key"
  public_key = tls_private_key.terraform_key.public_key_openssh
}

resource "aws_security_group" "allow_ssh" {
  name_prefix = "allow_ssh"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "example_instance" {
  ami                    = "ami-084568db4383264d4"
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.terraform_key.key_name
  vpc_security_group_ids = [aws_security_group.allow_ssh.id]

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = tls_private_key.terraform_key.private_key_pem
    host        = self.public_ip
  }

  provisioner "file" {
    content     = templatefile("${path.module}/env.tpl", { gemini_api_key = var.gemini_api_key })
    destination = "/home/ubuntu/.env.local"
  }

provisioner "remote-exec" {
  inline = [
    "sudo apt update -y",
    "sudo apt install -y curl docker.io",
    "sudo curl -L https://github.com/docker/compose/releases/download/v2.23.3/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose",
    "sudo chmod +x /usr/local/bin/docker-compose",
    "sudo apt update -y",
    "sudo systemctl start docker",
    "echo \"${GHCR_PAT}\" | docker login ghcr.io -u pavan731 --password-stdin",
    "sudo docker pull ghcr.io/pavan731/next-app:latest",
    "sudo docker run --env-file /home/ubuntu/.env.local -d -p 80:3000 ghcr.io/pavan731/next-app:latest"
  ]
}


  tags = {
    Name = "CI-CD-instance"
  }
}

output "instance_ip" {
  value = aws_instance.example_instance.public_ip
}


