class CreateQuestionSets < ActiveRecord::Migration[5.2]
  def change
    create_table :question_sets do |t|
      t.references :activity, foreign_key: true
      t.text :prompt
      t.integer :order

      t.timestamps
    end
  end
end
