# frozen_string_literal: true

class AddVersionToEvidenceActivity < ActiveRecord::Migration[6.0]
  def change
    add_column :comprehension_activities, :version, :smallint, null: false, default: 0
  end
end
