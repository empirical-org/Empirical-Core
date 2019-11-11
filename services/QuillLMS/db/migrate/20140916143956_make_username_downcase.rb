class MakeUsernameDowncase < ActiveRecord::Migration
  def change

    User.all.each { |u| 
      em = begin
             u.try(:email).downcase
           rescue
             nil
           end
      un = begin
             u.try(:username).downcase
           rescue
             nil
           end

      u.update_columns(email: em, username: un) }

  end
end
