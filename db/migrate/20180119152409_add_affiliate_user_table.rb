class AddAffiliateUserTable < ActiveRecord::Migration
  def change
    create_table :affiliate_user do |t|
      t.integer :user_id
      t.string  :affiliate_code

      t.timestamps
    end
  end
end
