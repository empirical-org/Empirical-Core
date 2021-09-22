class AddActivatedColumnToReferralsUser < ActiveRecord::Migration[4.2]
  def change
    add_column :referrals_users, :activated, :boolean, default: false
    add_index :referrals_users, :activated
  end
end
