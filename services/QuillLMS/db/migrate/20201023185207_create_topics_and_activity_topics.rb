class CreateTopicsAndActivityTopics < ActiveRecord::Migration
  def change
    create_table :topics do |t|
      t.string :name, null: false
      t.integer :level, null: false
      t.boolean :visible, null: false, default: :true
      t.integer :parent_id
    end
    add_foreign_key :topics, :topics, column: :parent_id, index: true
  end
end
