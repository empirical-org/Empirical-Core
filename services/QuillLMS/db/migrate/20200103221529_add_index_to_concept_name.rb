class AddIndexToConceptName < ActiveRecord::Migration
  def change
    add_index :concepts, :name
  end
end
