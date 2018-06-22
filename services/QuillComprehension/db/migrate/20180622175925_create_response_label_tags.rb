class CreateResponseLabelTags < ActiveRecord::Migration[5.2]
  def change
    create_table :response_label_tags do |t|
      t.references :response, foreign_key: true
      t.references :response_label, foreign_key: true
      t.integer :score

      t.timestamps
    end
  end
end
