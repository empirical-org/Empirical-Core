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

    {
      canvas: CanvasAuthCredential,
      google: GoogleAuthCredential,
      clever_district: CleverDistrictAuthCredential,
      clever_library: CleverLibraryAuthCredential
    }.each_pair do |provider, klass|
      klass.in_batches.update_all(provider: provider)
    end
  end
end
