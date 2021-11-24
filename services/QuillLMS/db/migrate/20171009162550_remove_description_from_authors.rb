# frozen_string_literal: true

class RemoveDescriptionFromAuthors < ActiveRecord::Migration[4.2]
  def change
    remove_column :authors, :description
  end
end
