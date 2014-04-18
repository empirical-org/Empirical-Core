system %q|/usr/local/heroku/bin/heroku run "rails r 'load(%(./script/begin_migration.rb))'" -a empirical-grammar-staging|

redofilepath = "redo"
redos = File.read(redofilepath).split("\n")
redofile = File.open(redofilepath, 'w')
redofile.sync = true

Chapter.order('id asc').each_slice(10) do |chapters|
  puts 'beginning loading a set for chapters: ' + chapters.map(&:id).join(' ')

  chapters.map do |chapter|
    puts 'loading '
    sleep 2

    thread = Thread.new do
      sleep 5
      puts 'starting now'
      puts   %Q|/usr/local/heroku/bin/heroku run "rails r 'load(%(./script/migrate_to_new_formats.rb))' #{chapter.id}" -a empirical-grammar-staging|
      system %Q|/usr/local/heroku/bin/heroku run "rails r 'load(%(./script/migrate_to_new_formats.rb))' #{chapter.id}" -a empirical-grammar-staging|

      if $?.exitstatus != 0
        puts "Failed to load #{chapter.id}"
        redofile.write(chapter.id.to_s + "\n")
      end
    end

    sleep 30
    thread
  end.each(&:join)

  puts 'end loading a set'
end

redofile.close
puts File.read(redofilepath)
