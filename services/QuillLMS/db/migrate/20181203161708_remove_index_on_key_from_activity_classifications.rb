class RemoveIndexOnKeyFromActivityClassifications < ActiveRecord::Migration[4.2]
  def change
    remove_index :activity_classifications, column: :key
  end
end
