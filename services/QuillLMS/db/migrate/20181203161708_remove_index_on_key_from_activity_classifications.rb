class RemoveIndexOnKeyFromActivityClassifications < ActiveRecord::Migration
  def change
    remove_index :activity_classifications, column: :key
  end
end
