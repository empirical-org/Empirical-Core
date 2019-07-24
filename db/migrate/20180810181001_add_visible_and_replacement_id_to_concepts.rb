class AddVisibleAndReplacementIdToConcepts < ActiveRecord::Migration
  def change
    add_column :concepts, :replacement_id, :integer, foreign_key: true
    add_column :concepts, :visible, :boolean, default: true
  end
end
