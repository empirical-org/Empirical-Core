# frozen_string_literal: true

class ChangeAuthCredentialTypeColumnNull < ActiveRecord::Migration[6.1]
  def change
    change_column_null :auth_credentials, :type, false
  end
end
