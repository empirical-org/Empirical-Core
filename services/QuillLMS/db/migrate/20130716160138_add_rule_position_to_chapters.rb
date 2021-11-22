# frozen_string_literal: true

class AddRulePositionToChapters < ActiveRecord::Migration[4.2]
  def change
    add_column :chapters, :rule_position, :text
  end
end
