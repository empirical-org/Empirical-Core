class CreateDistrictsAdminsTable < ActiveRecord::Migration[5.1]
  def change
    create_table :districts_admins do |t|
      t.references :district, null: false, index: true
      t.references :user, null: false, index: true

      t.timestamps null: false
    end
  end
end
