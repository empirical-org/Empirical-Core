# frozen_string_literal: true

class CreateContentPartnerActivities < ActiveRecord::Migration[4.2]
  def change
    create_table :content_partner_activities do |t|
      t.references :content_partner, foreign_key: true
      t.references :activity, foreign_key: true

      t.timestamps null: false
    end
  end
end
