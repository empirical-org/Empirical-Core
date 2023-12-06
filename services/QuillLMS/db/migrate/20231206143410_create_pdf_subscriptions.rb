# frozen_string_literal: true

class CreatePdfSubscriptions < ActiveRecord::Migration[7.0]
  def change
    create_table :pdf_subscriptions do |t|
      t.string :title, index: true, null: false
      t.string :frequency, index: true, null: false
      t.jsonb :filter_selections
      t.references :user, index: true, foreign_key: true, null: false

      t.timestamps
    end
  end
end
