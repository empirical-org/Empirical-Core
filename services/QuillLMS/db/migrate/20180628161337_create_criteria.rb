class CreateCriteria < ActiveRecord::Migration[4.2]
  def change
    create_table :criteria do |t|
      t.references :concept, index: true, foreign_key: true, null: false
      t.integer :count, default: 0, null: false
      t.integer :category, null: false
    end
  end
end
