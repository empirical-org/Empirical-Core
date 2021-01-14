class CreateComprehensionRules < ActiveRecord::Migration
  def change
    create_table :comprehension_rules do |t|
      t.string :uid
      t.string :name
      t.string :description
      t.boolean :universal
      t.string :type
      t.boolean :optimal
      t.integer :suborder
      t.string :concept_uid

      t.timestamps null: false
    end
    add_index :comprehension_rules, :uid
  end
end
