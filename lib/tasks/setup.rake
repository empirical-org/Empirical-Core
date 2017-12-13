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

    puts "** Creating database..."
    Rake::Task["db:create"].invoke

    puts "** Loading Structure..."
    Rake::Task['db:structure:load'].invoke

    puts "** Starting Redis..."
    `redis-server --port 6379 &`

    puts "** Seeding database..."
    Rake::Task["db:seed"].invoke

    puts "** Killing Redis..."
    `ps -ef | grep 'redis-server' | head -n 1 | awk '{ print $2}' | xargs kill -9`

    puts "** Setup complete!"
  end
end
