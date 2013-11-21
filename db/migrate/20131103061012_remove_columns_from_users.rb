class RemoveColumnsFromUsers < ActiveRecord::Migration
  def change
    remove_column :users, :email_activation_token, :string
    remove_column :users, :confirmable_set_at, :datetime
  end
end
