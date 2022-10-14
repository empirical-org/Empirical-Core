# frozen_string_literal: true

require 'open3'

namespace :synthetic do

  # set SYNTHETIC_LOCAL_PATH in .env
  # Find an activity_id (262 in this example)
  # Run: bundle exec rake synthetic:generate_seed_data\[262\]
  desc "generate seed data to local files"
  task :generate_seed_data, [:activity_id] => :environment do |t, args|
    activity_id = args[:activity_id]

    csv_hash = Evidence::Synthetic::SeedDataGenerator.csvs_for_activity(activity_id: activity_id)

    path = ENV.fetch('SYNTHETIC_LOCAL_PATH', '~/Documents/')

    csv_hash.each do |filename, contents|
      File.write("#{path}#{filename}", contents)
    end
  end
end
