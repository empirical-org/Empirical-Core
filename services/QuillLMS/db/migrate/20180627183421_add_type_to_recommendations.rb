class AddTypeToRecommendations < ActiveRecord::Migration
  def change
    add_column :recommendations, :type, :integer, null: false
  end
end
