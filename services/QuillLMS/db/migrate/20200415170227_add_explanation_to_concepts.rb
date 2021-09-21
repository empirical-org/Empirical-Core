class AddExplanationToConcepts < ActiveRecord::Migration[4.2]
  def change
    add_column :concepts, :explanation, :text
  end
end
