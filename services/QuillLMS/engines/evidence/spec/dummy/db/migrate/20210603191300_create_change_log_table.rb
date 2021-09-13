class CreateChangeLogTable < ActiveRecord::Migration[4.2]
  def change
    create_table :change_logs do |t|
      t.text :explanation
      t.string :action, null: false
      t.integer :changed_record_id, index: true, null: false
      t.string :changed_record_type, null: false
      t.integer :user_id, index: true
      t.string :changed_attribute
      t.string :previous_value
      t.string :new_value
      t.timestamps
    end
  end
end
