class AddOrderToRecommendations < ActiveRecord::Migration[4.2]
  def change
    add_column :recommendations, :order, :integer, null: false, default: 0
  end
end
