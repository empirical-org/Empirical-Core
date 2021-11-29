# frozen_string_literal: true

class RemoveNameUniquenessConstriantOnRecommendations < ActiveRecord::Migration[4.2]
  def change
    remove_index :recommendations, :name
  end
end
