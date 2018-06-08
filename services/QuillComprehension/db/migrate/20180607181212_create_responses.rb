class CreateResponses < ActiveRecord::Migration[5.2]
  def change
    create_table :responses do |t|
      t.references :question, foreign_key: true
      t.text :text
      t.integer :submissions, default: 1
      t.timestamps
    end
    add_index :responses, [:text, :question_id], unique: true
  end
end
