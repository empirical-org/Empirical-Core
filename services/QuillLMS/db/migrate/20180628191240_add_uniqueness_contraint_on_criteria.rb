class AddUniquenessContraintOnCriteria < ActiveRecord::Migration[4.2]
  def change
    add_index :criteria, [:recommendation_id, :concept_id, :category], unique: true
  end
end
