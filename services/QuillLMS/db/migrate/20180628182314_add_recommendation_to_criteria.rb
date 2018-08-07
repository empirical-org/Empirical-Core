class AddRecommendationToCriteria < ActiveRecord::Migration
  def change
    add_reference :criteria, :recommendation, index: true, foreign_key: true, null: false
  end
end
