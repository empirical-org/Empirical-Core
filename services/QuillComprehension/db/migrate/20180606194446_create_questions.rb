class CreateQuestions < ActiveRecord::Migration[5.2]
  def change
    create_table :questions do |t|
      t.text :prompt
      t.references :activity, foreign_key: true
      t.integer :order

      t.timestamps
    end
  end
end
