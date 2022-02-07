# frozen_string_literal: true

class AddDescriptionToRules < ActiveRecord::Migration[4.2]
  def up
    add_column :rules, :description, :text
  end

  def down
    remove_column :rules, :description
  end
end
