class CreateProviderClassroomUser < ActiveRecord::Migration[5.1]
  def change
    create_table :provider_classroom_users do |t|
      t.string :type, null: false
      t.string :provider_classroom_id, index: true, null: false
      t.string :provider_user_id, index: true, null: false
      t.timestamp :deleted_at

      t.timestamps
    end

    add_index :provider_classroom_users,
      [:provider_user_id, :provider_classroom_id, :type],
      name: :index_provider_user_id_and_provider_classroom_id_and_type,
      unique: true
  end
end
