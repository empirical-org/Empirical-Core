# frozen_string_literal: true

class RemoveProviderFromAuthCredential < ActiveRecord::Migration[6.1]
  def up
    remove_index :auth_credentials, :provider
    remove_column :auth_credentials, :provider
  end

  def down
    add_column :auth_credentials, :provider, :string
    add_index :auth_credentials, :provider

    AuthCredential.reset_column_information

    AuthCredential::TYPES.map(&:constantize).each do |klass|
      klass.update_all(provider: klass::PROVIDER)
    end
  end
end
