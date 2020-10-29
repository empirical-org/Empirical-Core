class PopulateTopics < ActiveRecord::Migration
  def change
    table = CSV.parse(File.read("lib/data/topics_by_activity.csv"), headers: true)
    table.each do |row|
      begin
        activity = Activity.find(row["Activity ID"])
        topic_columns = ["Level 0 Theme", "Level 1 Theme", "Level 2 Theme"]
        topic_columns.each_with_index do |tc, i|
          if tc.present? && row[tc] != "None"
            if i == 2
              parent_topic = Topic.find_or_create_by(name: row["Level 3 Theme"], level: 3)
              activity.topics << parent_topic
              topic = Topic.find_or_create_by(name: row[tc], level: i, parent_id: parent_topic.id)
            else
              topic = Topic.find_or_create_by(name: row[tc], level: i)
            end
            activity.topics << topic
          end
        end
      rescue => e
        puts e
      end
    end
  end
end
