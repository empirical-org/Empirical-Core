class CreateContentPartnerActivities < ActiveRecord::Migration
  def change
    create_table :content_partner_activities do |t|
      t.references :content_partner_id, foreign_key: true
      t.references :activity_id, foreign_key: true

      t.timestamps null: false
    end
  end
end
