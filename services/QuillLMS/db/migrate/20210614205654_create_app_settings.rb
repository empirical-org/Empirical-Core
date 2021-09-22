class CreateAppSettings < ActiveRecord::Migration[4.2]
  def change
    create_table :app_settings do |t|
      t.string :name, null: false
      t.integer :user_ids_allow_list, null: false, default: [], array: true
      t.boolean :enabled_for_admins, null: false, default: false
      t.boolean :enabled, null: false, default: false
      t.integer :percent_active, null: false, default: 0

      t.timestamps null: false
    end
    add_index :app_settings, :name, unique: true
  end
end
