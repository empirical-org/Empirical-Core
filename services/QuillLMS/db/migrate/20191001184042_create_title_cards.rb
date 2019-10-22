class CreateTitleCards < ActiveRecord::Migration
  def change
    create_table :title_cards do |t|
      t.string :uid
      t.string :content
      t.string :title

      t.timestamps null: false
    end
  end
end
