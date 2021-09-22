class CreateChangeLog < ActiveRecord::Migration[4.2]
  def change
    create_table :change_logs do |t|
      t.text :explanation, null: false
      t.string :action, null: false
      t.references :changed_record, polymorphic: true, index: true, null: false
      t.references :user, foreign_key: true, index: true, null: false
      t.timestamps
    end
  end
end
