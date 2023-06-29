# frozen_string_literal: true

class RemoveNullFalseFromAuthCredentialProvider < ActiveRecord::Migration[6.1]
  def change
    change_column_null :auth_credentials, :provider, true
  end
end
