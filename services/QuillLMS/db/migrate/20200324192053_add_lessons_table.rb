class AddLessonsTable < ActiveRecord::Migration
  def change
    create_table :lessons do |t|
      t.string :uid
      t.jsonb :data

      t.timestamps null: false

      t.index :uid, unique: true
    end
  end
end
