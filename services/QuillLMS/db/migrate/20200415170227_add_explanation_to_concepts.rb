class AddExplanationToConcepts < ActiveRecord::Migration
  def change
    add_column :concepts, :explanation, :text
  end
end
