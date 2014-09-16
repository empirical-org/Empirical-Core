class MakeUsernameDowncase < ActiveRecord::Migration
  def change

    User.all.each { |u| u.update_columns(email: "LOWER(email)", username: "LOWER(username)") }

  end
end
