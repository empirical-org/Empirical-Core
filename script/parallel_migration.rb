system %q|/usr/local/heroku/bin/heroku run "rails r \"load('./script/begin_migration.rb')\"" -a empirical-grammar-staging|

Chapter.all.map do |chapter|
  puts 'loading '
  sleep 2
  Thread.new do
    sleep 5
    puts 'starting now'
    system %Q|/usr/local/heroku/bin/heroku run "rails r \\"load('./script/migrate_to_new_formats.rb')\\" #{chapter.id}" -a empirical-grammar-staging|
  end
  sleep 30
end.each(&:join)
