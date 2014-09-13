class CreateDistricts < ActiveRecord::Migration
  def change
    create_table :districts do |t|
      t.string :clever_id, :name, :token

      t.timestamps
    end

    create_table :districts_users, id: false do |t|
      t.integer :district_id
      t.integer :user_id
    end

    add_index :districts_users, :district_id
    add_index :districts_users, :user_id
    add_index :districts_users, [:district_id, :user_id]
  end
end
