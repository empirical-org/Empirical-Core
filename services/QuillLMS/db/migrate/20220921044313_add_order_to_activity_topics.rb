class AddOrderToActivityTopics < ActiveRecord::Migration[6.1]
  def change
    add_column :activity_topics, :order, :integer, null: false, default: 0
  end
end
