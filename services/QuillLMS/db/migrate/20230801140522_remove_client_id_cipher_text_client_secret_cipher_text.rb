# frozen_string_literal: true

class RemoveClientIdCipherTextClientSecretCipherText < ActiveRecord::Migration[7.0]
  def change
    remove_column :canvas_configs, :client_id_ciphertext, :text, null: false
    remove_column :canvas_configs, :client_secret_ciphertext, :text, null: false
  end
end
