class AddLastSignInToUser < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :last_sign_in, :datetime
  end
end
