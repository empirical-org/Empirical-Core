# frozen_string_literal: true

class CreateTeacherNotificationSettings < ActiveRecord::Migration[6.1]
  def change
    create_table :teacher_notification_settings do |t|
      t.references :user, index: true, foreign_key: true, null: false
      t.text :notification_type, null: false

      t.timestamps
    end

    add_index :teacher_notification_settings, [:user_id, :notification_type], unique: true, name: 'index_teacher_notification_settings_on_user_id_and_type'
  end
end
