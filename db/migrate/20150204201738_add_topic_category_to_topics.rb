class AddTopicCategoryToTopics < ActiveRecord::Migration
  def change
    add_reference :topics, :topic_category, index: true
  end
end