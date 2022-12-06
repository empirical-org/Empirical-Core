# frozen_string_literal: true

namespace :concept_results_migration do
  task migrate_from_csv: :environment do
    pipe_data = $stdin.read unless $stdin.tty?

    unless pipe_data
      puts 'No data detected on STDIN.  You must pass data to the task for it to run.  Example:'
      puts '  rake concept_results_migration:migrate_from_csv < path/to/local/file.csv'
      puts ''
      puts 'If you are piping data into Heroku, you need to include the --no-tty flag:'
      puts '  heroku run rake concept_results_migration:migrate_from_csv -a empirical-grammar --no-tty < path/to/local/file.csv'
      exit 1
    end

    CSV.parse(pipe_data, headers: true) do |row|
      CopyOldConceptResultsToConceptResultsWorker.perform_async(row['start_id'], row['max_id'], true)
    rescue
      puts "Failed to enqueue worker for range (#{row['start_id']}..#{row['max_id']})"
    end
  end

  desc 'Enqueue all ConceptResult records for clean-up of their possibly duplicated "instructions" values'
  task clean_up_instructions: :environment do
    BATCH_SIZE=1_000_000

    start = 1
    finish = ConceptResult.maximum(:id)

    while start < finish
      end_of_batch = [start + BATCH_SIZE - 1, finish].min
      CleanConceptResultInstructionsWorker.perform_async(start, end_of_batch)
      start += BATCH_SIZE
    end
  end
end
