# frozen_string_literal: true

class AddIsRetryToActivitySessions < ActiveRecord::Migration[4.2]
  def change
    add_column :activity_sessions, :is_retry, :boolean, default: false
  end
end
