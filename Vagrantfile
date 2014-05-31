#!/usr/bin/env ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = '2'

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = 'ubuntu-14.04-amd64-vbox'
  config.vm.box_url = 'https://oss-binaries.phusionpassenger.com/vagrant/boxes/2014-05-11/ubuntu-14.04-amd64-vbox.box'

  config.vm.provision 'docker' do |d|
    d.pull_images 'paintedfox/postgresql'
    d.build_image '/app', args: '-t compass-app'
    d.run 'paintedfox/postgresql'
    d.run 'compass-app', cmd: 'cd /app ; rails s', args: '-v /app:/app -p 3000:3000 --link=postgresql:pg'
  end

  config.vm.network :forwarded_port, guest: 3000, host: 3000
  config.vm.synced_folder '.', '/app'
end
