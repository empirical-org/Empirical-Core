class AddTopicCategoryToTopics < ActiveRecord::Migration[4.2]
  def change
    add_reference :topics, :topic_category, index: true
  end
end