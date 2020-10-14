class CreateContentPartnerActivities < ActiveRecord::Migration
  def change
    create_table :content_partner_activities do |t|
      t.references :content_partner, foreign_key: true
      t.references :activity, foreign_key: true

      t.timestamps null: false
    end
  end
end
