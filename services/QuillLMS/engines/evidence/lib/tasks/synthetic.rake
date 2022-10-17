# frozen_string_literal: true

namespace :synthetic do

  # set SYNTHETIC_LOCAL_PATH in .env
  # Find an activity_id (262 in this example)
  # Specify a run_number (1 in this example) - for iteration to prevent overwriting older files
  # All conjunctions
  # Run: bundle exec rake synthetic:generate_seed_data\[262,1\]
  # Some conjunctions (NB: don't leave spaces after commas)
  # Run: bundle exec rake synthetic:generate_seed_data\[262,1,'but','so'\]
  desc "generate seed data to local files"
  task :generate_seed_data, [:activity_id, :run_number] => :environment do |t, args|
    activity_id = args[:activity_id]
    run_number = args[:run_number]
    conjunctions = args.extras.presence || Evidence::Synthetic::SeedDataGenerator::CONJUNCTIONS

    puts "Fetching data for #{activity_id}, conjunctions: #{conjunctions}, Run #{run_number}..."
    csv_hash = Evidence::Synthetic::SeedDataGenerator.csvs_for_activity(activity_id: activity_id, conjunctions: conjunctions)

    path = ENV.fetch('SYNTHETIC_LOCAL_PATH', '~/Documents/')

    csv_hash.each do |filename, contents|
      File.write("#{path}#{run_number}_#{filename}", contents)
    end
  end
end
