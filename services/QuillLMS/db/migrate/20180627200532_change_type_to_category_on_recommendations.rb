class ChangeTypeToCategoryOnRecommendations < ActiveRecord::Migration[4.2]
  def change
    rename_column :recommendations, :type, :category
  end
end
