class DropTopics < ActiveRecord::Migration
  def change
    drop_table :topics
    drop_table :topic_categories
    drop_table :sections
  end
end
