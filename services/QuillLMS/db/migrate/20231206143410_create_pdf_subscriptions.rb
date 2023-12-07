# frozen_string_literal: true

class CreatePdfSubscriptions < ActiveRecord::Migration[7.0]
  def change
    create_table :pdf_subscriptions do |t|
      t.string :frequency, index: true, null: false
      t.references :admin_report_filter_selection, index: true, foreign_key: true, null: false
      t.references :user, index: true, foreign_key: true, null: false

      t.timestamps
    end
  end
end
