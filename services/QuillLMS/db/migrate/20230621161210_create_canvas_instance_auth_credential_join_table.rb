# frozen_string_literal: true

class CreateCanvasInstanceAuthCredentialJoinTable < ActiveRecord::Migration[6.1]
  def change
    create_table :canvas_instance_auth_credentials do |t|
      t.references :canvas_instance, null: false, foreign_key: true
      t.references :auth_credential, null: false, foreign_key: true
    end
  end
end
