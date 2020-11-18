class AddTimestampsToTopics < ActiveRecord::Migration
  def change
    add_timestamps :topics
  end
end
