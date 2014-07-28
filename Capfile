# Load DSL and Setup Up Stages
require 'capistrano/setup'

# Includes default deployment tasks
require 'capistrano/deploy'
require 'capistrano/console'

# Loads custom tasks from `lib/capistrano/tasks' if you have any defined.
Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }

 set :ssh_options, {
   keys: %w(deploy-keys/empirical-linode),
 }

server 'docker-001.linode.empirical.org', user: 'root', roles: [:web, :app, :db]
