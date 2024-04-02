# frozen_string_literal: true

class AddNotificationEmailFrequencyToTeacherInfo < ActiveRecord::Migration[6.1]
  def change
    add_column :teacher_infos, :notification_email_frequency, :text
  end
end
