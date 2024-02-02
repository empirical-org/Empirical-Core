require 'optparse'
require 'erb'
require 'dotenv'

env_path = File.expand_path('../../.env', __FILE__)
Dotenv.load(env_path)

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: toggle_staging_db_locally.rb [options]"

  opts.on("-s", "--[no-]use-staging-db-config", "Use staging database configuration") do |s|
    options[:use_staging_db_config] = s
  end
end.parse!

use_staging_db_config = options[:use_staging_db_config] || false

# YAML template with ERB for conditional logic
yaml_template = <<~YAML
  default: &default
    adapter: postgresql
    encoding: unicode
    pool: <%%= ENV.fetch("MAX_THREADS") { 5 } %>
    prepared_statements: false
    timeout: 5000

  local_shared: &local_shared
    <<: *default
    host: localhost
    port: 5432

  primary_db_env: &primary_db_env
    <<: *default
    url: <%%= ENV['DATABASE_CONNECTION_POOL_URL'] || ENV['DATABASE_URL'] %>

  replica_db_env: &replica_db_env
    <<: *default
    url: <%%= ENV['REPLICA_DATABASE_CONNECTION_POOL_URL'] || ENV['REPLICA_DATABASE_URL'] || ENV['DATABASE_URL'] %>
    replica: true

  heroku_env: &heroku_env
    primary:
      <<: *primary_db_env
    replica:
      <<: *replica_db_env

  development:<%- if use_staging_db_config %>
    primary:
      url: <%%= ENV['DATABASE_URL'] %>
    replica:
      url: <%%= ENV['DATABASE_URL'] %>
      replica: true
  <% else %>
    primary:
      <<: *local_shared
      database: emp_gr_development
    replica:
      <<: *local_shared
      database: emp_gr_development
      replica: true

    #  For development group use this configuration temporarily for staging database locally
    #  Set in your .env file  DATABASE_URL=postgres://[long address from pg staging db]"
    #  Please do not commit this configuration below uncommented to git
    # primary:
    #   url: <%%= ENV['DATABASE_URL'] %>
    # replica:
    #   url: <%%= ENV['DATABASE_URL'] %>
    #   replica: true
  <% end %>
  # Warning: The database defined as "test" will be erased and
  # re-generated from your development database when you run "rake".
  # Do not set this db to the same as development or production.
  test:
    primary:
      <<: *local_shared
      database: emp_gr_test
    replica:
      <<: *local_shared
      database: emp_gr_test
      replica: true

  staging:
    <<: *heroku_env

  sprint:
    <<: *heroku_env

  production:
    <<: *heroku_env
YAML

renderer = ERB.new(yaml_template)
final_yaml = renderer.result(binding)

File.write('config/database.yml', final_yaml)

puts "Generated database.yml with #{use_staging_db_config ? 'staging' : 'local'} db configuration"

# Read the content of the .env file
env_content = File.readlines(env_path)

# rubocop:disable Lint/DuplicateBranch
modified_content = env_content.map do |line|
  if line.start_with?('DATABASE_URL')
    if use_staging_db_config && line.include?('postgresql://postgres@localhost')
      "# #{line}"
    elsif !use_staging_db_config && line.include?('postgres://')
      "# #{line}"
    else
      line
    end
  elsif line.start_with?('# DATABASE_URL')
    if use_staging_db_config && line.include?('postgres://')
      line.sub(/^# /, '')
    elsif !use_staging_db_config && line.include?('postgresql://postgres@localhost')
      line.sub(/^# /, '')
    else
      line
    end
  else
    line
  end
end
# rubocop:enable Lint/DuplicateBranch

# Write the modified content back to the .env file
File.open(env_path, 'w') { |file| file.puts(modified_content) }

puts "Updated .env file with #{use_staging_db_config ? 'staging' : 'local'} database config."
