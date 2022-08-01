# frozen_string_literal: true

namespace :concept_results_migration do
  task migrate_from_csv: :environment do
    pipe_data = $stdin.read unless $stdin.tty?

    unless pipe_data
      puts 'No data detected on STDIN.  You must pass data to the task for it to run.  Example:'
      puts '  rake users:refresh_school_subscriptions < path/to/local/file.csv'
      puts ''
      puts 'If you are piping data into Heroku, you need to include the --no-tty flag:'
      puts '  heroku run rake users:refresh_school_subscriptions -a empirical-grammar --no-tty < path/to/local/file.csv'
      exit 1
    end

    CSV.parse(pipe_data, headers: true) do |row|
      CopyOldConceptResultsToConceptResultsWorker.perform_async(row['start_id'], row['max_id'], true)
    rescue
      puts "Failed to enqueue worker for range (#{row['start_id']}..#{row['max_id']})"
    end
  end
end
