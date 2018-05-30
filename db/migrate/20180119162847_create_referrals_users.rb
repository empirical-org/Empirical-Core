class CreateReferralsUsers < ActiveRecord::Migration
  def change
    create_table :referrals_users do |t|
      t.integer :user_id, null: false
      t.integer :referred_user_id, null: false
      t.timestamps null: false
    end
    add_index :referrals_users, :user_id
    add_index :referrals_users, :referred_user_id, unique: true
  end
end
