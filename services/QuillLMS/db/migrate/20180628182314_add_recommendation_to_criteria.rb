class AddRecommendationToCriteria < ActiveRecord::Migration[4.2]
  def change
    add_reference :criteria, :recommendation, index: true, foreign_key: true, null: false
  end
end
