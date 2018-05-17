class ChangeContactUserIdNameAddAuthorizerId < ActiveRecord::Migration
  def change
    rename_column :subscriptions, :contact_user_id, :purchaser_id
    rename_column :subscriptions, :contact_email, :purchaser_email
  end
end
