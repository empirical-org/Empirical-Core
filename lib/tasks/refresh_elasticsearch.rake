namespace :elasticsearch do
  desc 'Refresh Elastic Search Index'
  task :refresh => :environment do
    refresh_elasticsearch
  end
end

def refresh_elasticsearch
  Response.__elasticsearch__.delete_index!
  puts "Deleted"
  Response.__elasticsearch__.create_index!
  puts "Created"
  Response.__elasticsearch__.import
  puts "Imported"
end
