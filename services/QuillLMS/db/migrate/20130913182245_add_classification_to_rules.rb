# frozen_string_literal: true

class AddClassificationToRules < ActiveRecord::Migration[4.2]
  def change
    add_column :rules, :classification, :string
  end
end
