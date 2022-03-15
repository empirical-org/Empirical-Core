class CreateDistrictsTable < ActiveRecord::Migration[5.1]
  def change
    create_table :districts_tables do |t|
      t.string :name, null: false
      t.string :nces_id, null: false
      t.string :city, null: false
      t.string :state, null: false
      t.integer :zipcode
      t.string :phone

      t.timestamps null: false
    end
  end
end
