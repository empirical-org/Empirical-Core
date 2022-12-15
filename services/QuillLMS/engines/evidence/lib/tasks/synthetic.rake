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

    label_config1 = {'label' => 'label11', 'examples' => ["it allows officials to view the same play from different angles.", "coaches and players trust the officials to make the correct call."]}
    label_config2 = {'label' => 'label7', 'examples' => ["66\% of public schools in the U.S. ban cell phone use anyway.", "students can easily be distracted by their phones."]}
    label_config3 = {'label' => 'label7', 'examples' => ["the International Handball Federation rewrote its rules in 2022 to allow players on women’s teams to wear tank tops and shorts.", "the Norwegian team protested."]}

    label_configs = {'because' => [label_config1, label_config2, label_config3]}

    puts "Fetching data for #{activity_id}, conjunctions: #{conjunctions}, Run #{run_number}, Label config #{label_configs}..."
    csv_hash = Evidence::Synthetic::SeedDataGenerator.csvs_for_activity(activity_id: activity_id, conjunctions: conjunctions, label_configs: label_configs)

    path = ENV.fetch('SYNTHETIC_LOCAL_PATH', '~/Documents/')

    csv_hash.each do |filename, contents|
      File.write("#{path}#{run_number}_#{filename}", contents)
    end
  end

  # Run: bundle exec rake synthetic:generate_labeled_data\['/Users/username/synthetic_surge_sample.csv',1\]
  desc "generate labeled data from a local file"
  task :generate_labeled_data, [:filepath, :run_number] => :environment do |t, args|
    filepath = args[:filepath]
    run_number = args[:run_number]

    text_labels = CSV.read(filepath)

    puts "Creating CSVs"
    csv_hash = Evidence::Synthetic::LabeledDataGenerator.csvs_from_run(text_labels, filepath, nil)

    csv_hash.each do |filename, contents|
      # insert run_number in filename
      filename_with_number = filename.sub(/.*\K\//, "/#{run_number}_")

      File.write(filename_with_number, contents)
    end
  end
end
