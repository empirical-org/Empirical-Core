# frozen_string_literal: true

class AddCreatedAtToUserActivityClassifications < ActiveRecord::Migration[7.0]
  def change
    add_column :user_activity_classifications, :created_at, :datetime, null: false, default: -> { 'CURRENT_TIMESTAMP' }
    add_column :user_activity_classifications, :updated_at, :datetime, null: false, default: -> { 'CURRENT_TIMESTAMP' }
  end
end
