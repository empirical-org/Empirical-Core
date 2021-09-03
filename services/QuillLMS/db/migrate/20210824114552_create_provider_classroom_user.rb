class CreateProviderClassroomUser < ActiveRecord::Migration[5.1]
  def change
    create_table :provider_classroom_users do |t|
      t.string :type, null: false
      t.string :provider_classroom_id, null: false
      t.string :provider_user_id, null: false
      t.timestamp :deleted_at

      t.timestamps
    end

    add_index :provider_classroom_users,
      [:type, :provider_classroom_id, :provider_user_id],
      name: :index_provider_type_and_classroom_id_and_user_id,
      unique: true
  end
end
