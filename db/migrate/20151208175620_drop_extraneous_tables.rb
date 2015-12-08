class DropExtraneousTables < ActiveRecord::Migration
  def change
    drop_table :concept_child_relations
    drop_table :t1
  end
end
