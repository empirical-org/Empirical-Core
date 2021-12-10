# frozen_string_literal: true

class DropNotifications < ActiveRecord::Migration[5.1]
  def change
    drop_table :notifications
  end
end
