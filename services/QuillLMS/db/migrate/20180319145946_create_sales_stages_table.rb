# frozen_string_literal: true

class CreateSalesStagesTable < ActiveRecord::Migration[4.2]
  def change
    create_table :sales_stages do |t|
      t.references :user, index: true, foreign_key: true
      t.references :sales_stage_type, index: true, foreign_key: true
      t.references :sales_contact, index: true, foreign_key: true
      t.datetime :completed

      t.timestamps
    end
  end
end
