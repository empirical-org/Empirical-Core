class RemoveConceptReferenceFromRecommendations < ActiveRecord::Migration[4.2]
  def change
    remove_reference :recommendations, :concept, index: true
  end
end
