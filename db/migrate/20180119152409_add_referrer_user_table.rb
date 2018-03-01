class AddReferrerUserTable < ActiveRecord::Migration
  def change
    create_table :referrer_users do |t|
      t.integer :user_id, null: false
      t.string  :referral_code, null: false
      t.timestamps
    end
    add_index :referrer_users, :user_id, unique: true
    add_index :referrer_users, :referral_code, unique: true
  end
end
