# frozen_string_literal: true

namespace :topics do
  desc 'Create topics from topics table'
  task :create => :environment do
    topics_table = CSV.parse(File.read("lib/data/parent_topics.csv"), headers: true)
    topics_table.each do |row|
      begin
        level_three_topic = Topic.find_or_create_by(name: row["Level 3"], level: 3)

        level_two_topic = Topic.find_or_create_by(name: row["Level 2"], level: 2)
        level_two_topic.update(parent_id: level_three_topic.id)

        level_one_topic = Topic.find_or_create_by(name: row["Level 1"], level: 1)
        level_one_topic.update(parent_id: level_two_topic.id)
      rescue => e
        puts "Error on Level One Topic: #{row['Level 1']}: #{e}"
      end
    end
  end
end
