# frozen_string_literal: true

class CreateResponseExtraMetadata < ActiveRecord::Migration[5.1]
  def change
    create_table :response_extra_metadata do |t|
      t.jsonb :metadata, null: false
      t.references :response, null: false, foreign_key: true
    end
  end
end
