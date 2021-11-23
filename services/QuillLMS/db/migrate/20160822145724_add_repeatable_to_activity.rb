# frozen_string_literal: true

class AddRepeatableToActivity < ActiveRecord::Migration[4.2]
  def change
    add_column :activities, :repeatable, :boolean, default: true
  end
end
