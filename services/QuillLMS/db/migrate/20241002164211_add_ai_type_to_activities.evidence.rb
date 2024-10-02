# frozen_string_literal: true

# This migration comes from evidence (originally 20241002153807)
class AddAITypeToActivities < ActiveRecord::Migration[7.1]
  def change
    add_column :comprehension_activities, :ai_type, :string
  end
end
