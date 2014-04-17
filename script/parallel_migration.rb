system %q|/usr/local/heroku/bin/heroku run "rails r \"load('./script/begin_migration.rb')\"" -a empirical-grammar-staging|

Chapter.all.each_slice(10) do |chapters|
  chapters.map do |chapter|
    puts 'loading '
    sleep 2
    thread = Thread.new do
      sleep 5
      puts 'starting now'
      puts   %Q|/usr/local/heroku/bin/heroku run "rails r \\"load('./script/migrate_to_new_formats.rb')\\" #{chapter.id}" -a empirical-grammar-staging|
      system %Q|/usr/local/heroku/bin/heroku run "rails r \\"load('./script/migrate_to_new_formats.rb')\\" #{chapter.id}" -a empirical-grammar-staging|
    end
    sleep 30
    thread
  end.each(&:join)
end
