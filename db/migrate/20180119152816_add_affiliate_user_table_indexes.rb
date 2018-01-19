class AddAffiliateUserTableIndexes < ActiveRecord::Migration
  def change
    add_index :affiliate_user, :user_id, unique: true
    add_index :affiliate_user, :affiliate_code, unique: true
  end
end
