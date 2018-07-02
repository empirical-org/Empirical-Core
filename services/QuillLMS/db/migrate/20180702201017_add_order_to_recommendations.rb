class AddOrderToRecommendations < ActiveRecord::Migration
  def change
    add_column :recommendations, :order, :integer, null: false, default: 0
  end
end
