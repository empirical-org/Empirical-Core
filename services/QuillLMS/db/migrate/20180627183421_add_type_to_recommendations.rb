class AddTypeToRecommendations < ActiveRecord::Migration[4.2]
  def change
    add_column :recommendations, :type, :integer, null: false
  end
end
