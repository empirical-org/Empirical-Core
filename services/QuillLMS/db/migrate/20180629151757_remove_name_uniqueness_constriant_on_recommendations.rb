class RemoveNameUniquenessConstriantOnRecommendations < ActiveRecord::Migration
  def change
    remove_index :recommendations, :name
  end
end
