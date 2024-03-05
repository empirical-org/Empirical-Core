# frozen_string_literal: true

class UpdateEvidenceActivityDefaultVersion < ActiveRecord::Migration[6.1]
  def change
    change_column_default :comprehension_activities, :version, 1
  end
end
