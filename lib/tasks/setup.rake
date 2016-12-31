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

    puts "** Loading Schema..."
    Rake::Task['db:schema:load'].invoke

    puts "** Seeding database..."
    Rake::Task["db:seed"].invoke

    puts "** Setup complete!"
  end
end
