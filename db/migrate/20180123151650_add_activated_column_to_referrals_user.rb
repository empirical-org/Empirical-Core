class AddActivatedColumnToReferralsUser < ActiveRecord::Migration
  def change
    add_column :referrals_users, :activated, :boolean, default: false
    add_index :referrals_users, :activated
  end
end
