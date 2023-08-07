# frozen_string_literal: true

namespace :redis do
  task :delete_keys => :environment do
    $redis.keys.each do |k|
      puts "deleting key #{k}"
      Rails.cache.delete k
    end
    puts 'finished'
  end


end
