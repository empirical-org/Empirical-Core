class CreateConcepts < ActiveRecord::Migration[4.2]
  def change
    create_table :concepts do |t|
      t.string :name
      t.timestamps
    end
  end
end