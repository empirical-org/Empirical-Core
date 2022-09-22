# frozen_string_literal: true

namespace :topics do
  desc 'Attach topics from new_topics_to_activities csv'
  task :attach => :environment do
    topics_table = CSV.parse(File.read("lib/data/new_topics_to_activities.csv"), headers: true)
    topics_table.each do |row|
      activity = Activity.find_by(id: row["Activity ID"])
      next if activity.blank?

      topic_names = [row["Topic 1"], row["Topic 2"], row["Topic 3"]]
      topic_ids = topic_names.map { |topic_name| Topic.find_by(name: topic_name)&.id }
      activity.topic_ids = topic_ids
      activity.save!
    rescue => e
      puts "Error on Activity: #{row['Activity ID']}: #{e}"
    end
  end
end
