# frozen_string_literal: true

class RemoveAvatarFromAuthors < ActiveRecord::Migration[4.2]
  def change
    remove_attachment :authors, :avatar
  end
end
