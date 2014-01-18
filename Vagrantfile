# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # Use the ubuntu precise 64-bit base box
  config.vm.box = "precise64"

  # Using official vagrant download location
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  # Forward localhost:3000 -> vagrant:3000 so that we can access WEBrick
  config.vm.network :forwarded_port, guest: 3000, host: 3000

  # Run a shell script on provisioning to install all dependencies
  # Not running as root to help with installing rvm in single user mode
  # TODO: Use Chef or Puppet instead of just a script
  config.vm.provision :shell, :path => "script/bootstrap.sh", :privileged => false
end
