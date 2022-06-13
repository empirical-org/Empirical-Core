# frozen_string_literal: true

class CreateNotifications < ActiveRecord::Migration[4.2]
  def change
    create_table :notifications
  end
end
