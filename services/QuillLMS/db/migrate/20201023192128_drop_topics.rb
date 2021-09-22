class DropTopics < ActiveRecord::Migration[4.2]
  def change
    drop_table :topics
    drop_table :topic_categories
    drop_table :sections
  end
end
