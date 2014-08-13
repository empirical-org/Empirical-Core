class CreateDistricts < ActiveRecord::Migration
  def change
    create_table :districts do |t|
      t.string :clever_id, :name, :token

      t.timestamps
    end

    add_column :schools, :district_id, :integer
  end
end
