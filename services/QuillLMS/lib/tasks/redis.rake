# frozen_string_literal: true

namespace :redis do
  task :delete_keys => :environment do
    Rails.cache.redis.keys("*").each do |key|
      puts "deleting key #{key}"
      Rails.cache.delete(key)
    end
    puts 'finished'
  end


end
