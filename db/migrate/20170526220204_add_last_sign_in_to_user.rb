class AddLastSignInToUser < ActiveRecord::Migration
  def change
    add_column :users, :last_sign_in, :datetime
  end
end
