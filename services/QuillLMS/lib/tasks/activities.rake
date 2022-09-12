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

  desc "replace 'archive' flag with 'archived'"
  task :replace_archive_flag_with_archived => :environment do
    activities = Activity.where(flags: ['archive'])
    activities.update_all(flags: ['archived'])
  end

  desc 'Take pipe of CSV with activity names to be set to "private"'
  task set_to_private_by_name: :environment do
    pipe_data = $stdin.read unless $stdin.tty?

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
      activity.save!
    rescue
      puts "Failed to update for activity named '#{row['name']}'"
    end
  end

  desc 'Take a pipe of CSV with activity IDs and new names, set the specified Activities to their new name'
  task bulk_update_names: :environment do
    pipe_data = $stdin.read unless $stdin.tty?

    unless pipe_data
      puts 'No data detected on STDIN.  You must pass data to the task for it to run.  Example:'
      puts '  rake activities:bulk_update_names < path/to/local/file.csv'
      puts ''
      puts 'If you are piping data into Heroku, you need to include the --no-tty flag:'
      puts '  heroku run rake activities:bulk_update_names -a empirical-grammar --no-tty < path/to/local/file.csv'
      exit 1
    end

    CSV.parse(pipe_data, headers: true) do |row|
      activity = Activity.find(row['Activity ID'])
      activity.update!(name: row['New Name'])
    rescue
      puts "Failed to update for activity with id '#{row['Activity ID']}'"
    else
      puts "Updated activity with id '#{row['Activity ID']}' to '#{row['New Name']}'"
    end
  end
end
