namespace :redis do
  task :delete_keys => :environment do
    $redis.keys.each do |k|
      puts "deleting key #{k}"
      $redis.del k
    end
    puts 'finished'
  end


end
