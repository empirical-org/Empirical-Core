# frozen_string_literal: true

namespace :topics do
  desc 'Create topics from topics table'
  task :create => :environment do
    topics_table = CSV.parse(File.read("lib/data/parent_topics.csv"), headers: true)
    topics_table.each do |row|
      level_three_topic = Topic.find_or_create_by(name: row["Level 3"], level: 3)

      level_two_topic = Topic.find_or_create_by(name: row["Level 2"], level: 2)
      level_two_topic.update!(parent_id: level_three_topic.id)

      level_one_topic = Topic.find_or_create_by(name: row["Level 1"], level: 1)
      level_one_topic.update!(parent_id: level_two_topic.id)
    rescue => e
      puts "Error on Level One Topic: #{row['Level 1']}: #{e}"
    end
  end

  desc 'Attach topics from new_topics_to_activities csv'
  task :attach => :environment do
    topics_table = CSV.parse(File.read("lib/data/new_topics_to_activities.csv"), headers: true)
    topics_table.each do |row|
      activity = Activity.find_by(id: row["Activity ID"])
      next if activity.blank?

      topic_names = [row["Topic 1"], row["Topic 2"], row["Topic 3"]]
      activity.topic_ids = topic_names.map { |topic_name| Topic.find_by(name: topic_name)&.id }.compact
      activity.save!
    rescue => e
      puts "Error on Activity: #{row['Activity ID']}: #{e}"
    end
  end
end
