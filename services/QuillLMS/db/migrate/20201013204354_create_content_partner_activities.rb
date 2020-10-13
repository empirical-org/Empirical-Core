class CreateContentPartnerActivities < ActiveRecord::Migration
  def change
    create_table :content_partner_activities do |t|
      t.integer :content_partner_id
      t.integer :activity_id

      t.timestamps null: false
    end
  end
end
