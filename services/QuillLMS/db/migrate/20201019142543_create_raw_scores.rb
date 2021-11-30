# frozen_string_literal: true

class CreateRawScores < ActiveRecord::Migration[4.2]
  def change
    create_table :raw_scores do |t|
      t.string :name, null: false

      t.timestamps null: false
    end
  end
end
