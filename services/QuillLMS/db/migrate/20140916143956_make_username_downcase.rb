# frozen_string_literal: true

class MakeUsernameDowncase < ActiveRecord::Migration[4.2]
  def change

    User.all.each { |u|
      em = u.try(:email).downcase rescue nil
      un = u.try(:username).downcase rescue nil

      u.update_columns(email: em, username: un) }

  end
end
