class CreateVocabularyWords < ActiveRecord::Migration[5.2]
  def change
    create_table :vocabulary_words do |t|
      t.references :activity, foreign_key: true
      t.text :text
      t.text :description
      t.text :example
      t.integer :order

      t.timestamps
    end
  end
end
