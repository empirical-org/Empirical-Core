# frozen_string_literal: true

class CreateAdminReportFilterSelections < ActiveRecord::Migration[7.0]
  def change
    create_table :admin_report_filter_selections do |t|
      t.string :report, index: true, null: false
      t.jsonb :filter_selections
      t.references :user, index: true, foreign_key: true, null: false

      t.timestamps
    end
  end
end
