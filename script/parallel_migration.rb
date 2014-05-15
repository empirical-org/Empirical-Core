system %q|/usr/local/heroku/bin/heroku run "rails r 'load(%(./script/begin_migration.rb))'" -a empirical-grammar-staging|

chapters = Chapter.order('id asc')

chapters.map do |chapter|
  puts 'starting now'
  puts   %Q|/usr/local/heroku/bin/heroku run "rails r 'load(%(./script/migrate_to_new_formats.rb))' #{chapter.id}" -a empirical-grammar-staging|
  res =    `/usr/local/heroku/bin/heroku run "rails r 'load(%(./script/migrate_to_new_formats.rb))' #{chapter.id}" -a empirical-grammar-staging`
end
