class CreateRules < ActiveRecord::Migration
  def change
    create_table :rules do |t|
      t.integer :order
      t.text :body
      t.integer :chapter_id

      t.timestamps
    end
  end
end
