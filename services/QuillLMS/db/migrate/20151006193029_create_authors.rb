class CreateAuthors < ActiveRecord::Migration[4.2]
  def change
    create_table :authors do |t|
      t.string :name
    end
  end
end
