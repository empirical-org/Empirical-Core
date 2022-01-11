# frozen_string_literal: true

namespace :activities do
  desc 'Strip name prefixes like Sentence Writing: and Passage Proofreading: '
  task :strip_name_prefixes => :environment do
    prefixes = [
      'Sentence Writing: ',
      'Passage Proofreading: '
    ]
    Activity.find_each do |activity|
      prefixes.each do |prefix|
        if activity.name.present?
          activity.name = activity.name.gsub(prefix, '')
        end
      end
      activity.save!
    end
  end

  desc 'Take pipe of CSV with activity names to be set to "private"'
  task set_to_private_by_name: :environment do
    pipe_data = STDIN.read unless STDIN.tty?

    unless pipe_data
      puts 'No data detected on STDIN.  You must pass data to the task for it to run.  Example:'
      puts '  rake activities:set_to_private_by_name < path/to/local/file.csv'
      puts ''
      puts 'If you are piping data into Heroku, you need to include the --no-tty flag:'
      puts '  heroku run rake activities:set_to_private_by_name -a empirical-grammar --no-tty < path/to/local/file.csv'
      exit 1
    end

    CSV.parse(pipe_data, headers: true) do |row|
      activity = Activity.find_by(name: row['name'])
      activity.flag = 'private'
      activity.save
    rescue
      puts "Failed to update for activity named '#{row['name']}'"
    end
  end
end
