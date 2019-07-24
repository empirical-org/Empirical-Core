class RemoveConceptReferenceFromRecommendations < ActiveRecord::Migration
  def change
    remove_reference :recommendations, :concept, index: true
  end
end
