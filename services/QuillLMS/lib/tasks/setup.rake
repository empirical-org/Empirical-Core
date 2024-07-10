# frozen_string_literal: true

namespace :empirical do
  task :setup do
    puts "\n✏️  Let's get your development environment set up, shall we?"
    puts "\n✏️  Note: this may take a few minutes, so please be patient."

    puts "\n📁 Creating tmp directories..."
    Rake::Task['tmp:create'].invoke

    unless File.exist?('config/database.yml')
      puts "\n🗄  Copying DB Credentials..."
      `cp config/database.yml.example config/database.yml`
    end

    puts "\n🤫 Copying env variables..."
    `cp -n .env-sample .env`

    puts "\n🗄  Dropping database...\n\n"
    Rake::Task['db:drop'].invoke

    puts "\n🗄  Creating database..."
    Rake::Task['db:create'].invoke

    puts "\n⚙️  Loading structure..."
    Rake::Task['db:schema:load'].invoke

    puts "\n📮 Starting Redis..."
    `redis-server --daemonize yes`
    `redis-server --port 7654 --daemonize yes`

    puts "\n🗄  Seeding database...\n"
    Rake::Task['local_data:truncate_nonuser_tables'].invoke

    puts "\n📮 Killing Redis..."
    `ps -ef | grep 'redis-server' | head -n 2 | awk '{ print $2}' | xargs kill -9`

    puts "\n📦 Installing NPM packages...\n\n"
    `npm install && cd ./client/ && npm install && cd ..`

    puts "\n✏️  Setup complete."
    puts "\n✏️  Welcome to the Quill.org open source community!"
    puts "\n✏️  We can't wait to see what you build.\n\n"
    `open https://docs.quill.org`
  end
end
