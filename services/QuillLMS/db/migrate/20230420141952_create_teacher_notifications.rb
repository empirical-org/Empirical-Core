# frozen_string_literal: true

class CreateTeacherNotifications < ActiveRecord::Migration[6.1]
  def change
    create_table :teacher_notifications do |t|
      t.references :user, index: true, foreign_key: true, null: false
      t.text :notification_type, null: false
      t.datetime :email_sent
      t.jsonb :message_attrs

      t.timestamps
    end
  end
end
