namespace :empirical do
  task :setup do
    puts "** Starting setup..."

    puts "** Creating tmp directories..."
    Rake::Task["tmp:create"].invoke

    unless File.exist?("config/database.yml")
      puts "** Copying DB Credentials..."
      `cp config/database.yml.example config/database.yml`
    end

    puts '** Copying env variables...'
    `cp .env-sample .env`

    puts "** Dropping database..."
    Rake::Task["db:drop"].invoke

    puts "** Creating database..."
    Rake::Task["db:create"].invoke

    puts "** Loading structure..."
    Rake::Task['db:structure:load'].invoke

    puts "** Starting Redis..."
    `redis-server --port 6379 --daemonize yes`
    `redis-server --port 7654 --daemonize yes`

    puts "** Seeding database..."
    Rake::Task["db:seed"].invoke

    puts "** Killing Redis..."
    `ps -ef | grep 'redis-server' | head -n 2 | awk '{ print $2}' | xargs kill -9`

    puts "** Installing NPM packages..."
    `npm install && cd ./client/ && npm install && cd ..`

    puts "** Building the vendor bundle..."
    `npm run build:test`

    puts "** Setup complete!"
  end
end
