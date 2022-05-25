# frozen_string_literal: true

class CreateResponseAnswer < ActiveRecord::Migration[5.1]
  def change
    create_table :response_answers do |t|
      t.jsonb :json, null: false

      t.datetime :created_at, null: false

      t.index :json, unique: true
    end
  end
end
