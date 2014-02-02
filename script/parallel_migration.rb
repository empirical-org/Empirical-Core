system %q|heroku run "rails r \"load('./script/begin_migration.rb')\"" -a empirical-grammar-staging|

Chapter.all.map do |chapter|
  Thread.new do
    system %Q|heroku run "rails r \\"load('./script/migrate_to_new_formats.rb')\\"" -a empirical-grammar-staging|
  end
end.each(&:join)
