class AddVisibleAndReplacementIdToConcepts < ActiveRecord::Migration[4.2]
  def change
    add_column :concepts, :replacement_id, :integer, foreign_key: true
    add_column :concepts, :visible, :boolean, default: true
  end
end
