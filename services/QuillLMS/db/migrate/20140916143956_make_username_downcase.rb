class MakeUsernameDowncase < ActiveRecord::Migration
  def change

    User.all.each { |u| 
      em = u.try(:email).downcase rescue nil
      un = u.try(:username).downcase rescue nil

      u.update_columns(email: em, username: un) }

  end
end
