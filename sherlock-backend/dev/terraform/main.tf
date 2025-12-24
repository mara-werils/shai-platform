terraform {
  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "~> 3.0"
    }
  }
}

provider "null" {}

resource "null_resource" "provision" {
  connection {
    type        = "ssh"
    host        = var.host
    user        = var.ssh_user
    private_key = file(var.private_key_path)
  }

  # 1) Create required directories before copying files
  provisioner "remote-exec" {
    inline = [
      "sudo mkdir -p /data/sherlock",
      "sudo mkdir -p ${var.volume_path}/plugin_daemon",
      "sudo mkdir -p ${var.volume_path}/sandbox/dependencies",
      "sudo mkdir -p ${var.volume_path}/sandbox/conf",
      "sudo mkdir -p ${var.volume_path}/ssrf_proxy",
      "sudo mkdir -p ${var.volume_path}/app/storage",
      "sudo mkdir -p ${var.volume_path}/db/data",
      "sudo mkdir -p ${var.volume_path}/redis/data",
      "sudo mkdir -p ${var.volume_path}/weaviate"
    ]
  }

  # 2) Copy files into proper directories
  provisioner "file" {
    source      = "${path.module}/../../docker/ssrf_proxy/docker-entrypoint.sh"
    destination = "/home/${var.ssh_user}/docker-entrypoint.sh"
  }
  provisioner "file" {
    source      = "${path.module}/../../docker/ssrf_proxy/squid.conf.template"
    destination = "/home/${var.ssh_user}/squid.conf.template"
  }
  provisioner "file" {
    source      = "${path.module}/../../docker/volumes/sandbox/conf/config.yaml"
    destination = "/home/${var.ssh_user}/config.yaml"
  }
  provisioner "file" {
    source      = "${path.module}/../../docker/volumes/sandbox/dependencies/python-requirements.txt"
    destination = "/home/${var.ssh_user}/python-requirements.txt"
  }
  provisioner "file" {
    source      = "${path.module}/../../docker/nginx/nginx.conf.template"
    destination = "/home/${var.ssh_user}/nginx.conf.template"
  }
  provisioner "file" {
    source      = "${path.module}/../../docker/nginx/proxy.conf.template"
    destination = "/home/${var.ssh_user}/proxy.conf.template"
  }
  provisioner "file" {
    source      = "${path.module}/../../docker/nginx/conf.d/default.conf.template"
    destination = "/home/${var.ssh_user}/default.conf.template"
  }
  provisioner "file" {
    source      = "${path.module}/../../docker/nginx/ssl/fullchain.pem"
    destination = "/home/${var.ssh_user}/fullchain.pem"
  }
  provisioner "file" {
    source      = "${path.module}/../../docker/nginx/ssl/privkey.pem"
    destination = "/home/${var.ssh_user}/privkey.pem"
  }
  provisioner "file" {
    source      = "${path.module}/../../docker/swarm/web.yml"
    destination = "/home/${var.ssh_user}/web.yml"
  }
  provisioner "file" {
    source      = "${path.module}/../../docker/swarm/tools.yml"
    destination = "/home/${var.ssh_user}/tools.yml"
  }
  provisioner "file" {
    source      = "${path.module}/../../docker/swarm/api.yml"
    destination = "/home/${var.ssh_user}/api.yml"
  }
  provisioner "file" {
    source      = "${path.module}/../../docker/swarm/db.yml"
    destination = "/home/${var.ssh_user}/db.yml"
  }
  provisioner "file" {
    source      = "${path.module}/../../docker/.env.example"
    destination = "/home/${var.ssh_user}/.env.example"
  }

  # 3) Install, configure, and deploy
  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update -y",
      "sudo apt-get install -y docker.io python3-pip nginx certbot python3-certbot-nginx",
      "sudo systemctl enable docker",
      "sudo systemctl enable nginx",
      "sudo systemctl start docker",
      "sudo systemctl start nginx",
      "sudo mv /home/${var.ssh_user}/docker-entrypoint.sh ${var.volume_path}/ssrf_proxy/docker-entrypoint.sh",
      "sudo mv /home/${var.ssh_user}/squid.conf.template ${var.volume_path}/ssrf_proxy/squid.conf.template",
      "sudo mv /home/${var.ssh_user}/config.yaml ${var.volume_path}/sandbox/conf/config.yaml",
      "sudo mv /home/${var.ssh_user}/python-requirements.txt ${var.volume_path}/sandbox/dependencies/python-requirements.txt",
      "sudo mv /home/${var.ssh_user}/nginx.conf.template /etc/nginx/nginx.conf.template",
      "sudo mv /home/${var.ssh_user}/proxy.conf.template /etc/nginx/proxy.conf",
      "sudo mv /home/${var.ssh_user}/default.conf.template /etc/nginx/conf.d/default.conf.template",
      "sudo mv /home/${var.ssh_user}/fullchain.pem /etc/nginx/ssl/fullchain.pem",
      "sudo mv /home/${var.ssh_user}/privkey.pem /etc/nginx/ssl/privkey.pem",
      "sudo mv /home/${var.ssh_user}/web.yml /data/sherlock/web.yml",
      "sudo mv /home/${var.ssh_user}/api.yml /data/sherlock/api.yml",
      "sudo mv /home/${var.ssh_user}/db.yml /data/sherlock/db.yml",
      "sudo mv /home/${var.ssh_user}/tools.yml /data/sherlock/tools.yml",
      "sudo mv /home/${var.ssh_user}/.env.example /data/sherlock/.env",
      "sudo nginx -t",
      "sudo nginx -s reload",
      "sudo docker swarm init --advertise-addr $(hostname -I | awk '{print $1}') || true",
      "sudo docker network inspect nw_swarm >/dev/null 2>&1 || sudo docker network create --driver overlay --attachable nw_swarm",
      "cd /data/sherlock",
      "sudo docker stack deploy --with-registry-auth -c db.yml --prune db",
      "sudo docker stack deploy --with-registry-auth -c tools.yml --prune tools",
      "export IMAGE=${var.web_image}",
      "sudo docker stack deploy --with-registry-auth -c web.yml --prune web",
      "export IMAGE=${var.api_image}",
      "sudo docker stack deploy --with-registry-auth -c api.yml --prune api",
    ]
  }
}
