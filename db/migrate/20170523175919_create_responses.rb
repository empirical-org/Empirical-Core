class CreateResponses < ActiveRecord::Migration[5.1]
  def change
    create_table :responses do |t|
      t.string :uid
      t.integer :parent_id
      t.string :parent_uid
      t.string :question_uid
      t.string :author
      t.text :text
      t.text :feedback
      t.integer :count
      t.integer :first_attempt_count
      t.integer :child_count
      t.boolean :optimal
      t.boolean :weak
      t.json :concept_results

      t.timestamps

      t.index :uid
      t.index :parent_uid
      t.index :question_uid
      t.index :text
      t.index :author
      t.index :optimal
    end
  end
end
