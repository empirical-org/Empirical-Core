# frozen_string_literal: true

class AddTypeToAuthCredential < ActiveRecord::Migration[6.1]
  def change
    add_column :auth_credentials, :type, :string
  end
end
