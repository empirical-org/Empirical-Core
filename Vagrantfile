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

  # SSH connections made will enable agent forwarding.
  config.ssh.forward_agent = true

  # Provision with chef-solo + berkshelf
  config.vm.provision :chef_solo do |chef|
    ENV['LANGUAGE'] = ENV['LANG'] = ENV['LC_ALL'] = "en_US.UTF-8"
    chef.add_recipe "apt"
    chef.add_recipe "postgresql::server"
    chef.add_recipe "postgresql::ruby"
    chef.add_recipe "ruby_build"
    chef.add_recipe "rbenv::vagrant"
    chef.add_recipe "rbenv::user"
    chef.add_recipe "rbenv-vars"
    chef.add_recipe "nodejs"
    chef.add_recipe "quill"

    # Shared config settings
    user = 'vagrant'
    ruby_version = '1.9.3-p484'

    chef.json = {
      'apt' => {'compiletime' => true},
      'rbenv' => {
        'root_path' => '/home/vagrant/.rbenv',
        'user_installs' => [
          {
            'user'    => user,
            'rubies'  => [ruby_version],
            'global'  => ruby_version,
            'gems'    => {
              ruby_version => [
                { 'name'    => 'bundler' }
              ]
            }
          }
        ]
      },
      "postgresql" => {
        "password" => {
          "postgres" => 'postgres'
        }
      },
      'quill' => {
        'user' => user,
        'cwd' => '/vagrant',
        'ruby' => ruby_version,
        'db' => {
          'username' => 'postgres',
          'password' => 'postgres'
        }
      }
    }
  end
end
