class ChangeTypeToCategoryOnRecommendations < ActiveRecord::Migration
  def change
    rename_column :recommendations, :type, :category
  end
end
