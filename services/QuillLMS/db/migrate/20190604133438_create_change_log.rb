class CreateChangeLog < ActiveRecord::Migration
  def change
    create_table :change_logs do |t|
      t.text :explanation
      t.references :changed, polymorphic: true, index: true
      t.references :user, foreign_key: true, index: true
      t.timestamps
    end
  end
end
