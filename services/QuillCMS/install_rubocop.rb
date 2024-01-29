require 'rubygems'

gem_names = %w[rubocop rubocop-rspec rubocop-rails]
gemfile_lock = File.read('Gemfile.lock')

gem_names.each do |gem_name|
  gem_version = gemfile_lock.match(/#{gem_name} \((.*?)\)/)[1]

  if gem_version.nil?
    system("gem install #{gem_name}")
  else
    system("gem install #{gem_name} -v #{gem_version}")
  end

  if $?.success?
    puts "Installed #{gem_name}#{gem_version ? " (v#{gem_version})" : ''}"
  else
    puts "Failed to install #{gem_name}#{gem_version ? " (v#{gem_version})" : ''}"
  end
end

system('bundle exec rubocop')
