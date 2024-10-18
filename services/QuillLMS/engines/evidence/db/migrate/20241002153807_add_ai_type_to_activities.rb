# frozen_string_literal: true

class AddAITypeToActivities < ActiveRecord::Migration[7.1]
  def change
    add_column :comprehension_activities, :ai_type, :string
  end
end
