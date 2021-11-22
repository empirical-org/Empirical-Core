# frozen_string_literal: true

class CreateWorkbooks < ActiveRecord::Migration[4.2]
  def change
    create_table :workbooks do |t|
      t.string :title

      t.timestamps
    end
  end
end
