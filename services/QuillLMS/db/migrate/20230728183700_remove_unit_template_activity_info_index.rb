# frozen_string_literal: true

class RemoveUnitTemplateActivityInfoIndex < ActiveRecord::Migration[6.1]
  def change
    remove_index :unit_templates, :activity_info
  end
end
