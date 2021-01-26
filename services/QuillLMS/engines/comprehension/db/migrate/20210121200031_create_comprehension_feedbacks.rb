class CreateComprehensionFeedbacks < ActiveRecord::Migration
  def change
    create_table :comprehension_feedbacks do |t|
      t.references :rule, null: false
      t.string :text, null: false
      t.string :description
      t.integer :order, null: false

      t.timestamps null: false
    end
    add_index :comprehension_feedbacks, [:rule_id, :order], unique: true
  end
  
end
