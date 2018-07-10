class AddUniquenessContraintOnCriteria < ActiveRecord::Migration
  def change
    add_index :criteria, [:recommendation_id, :concept_id, :category], unique: true
  end
end
