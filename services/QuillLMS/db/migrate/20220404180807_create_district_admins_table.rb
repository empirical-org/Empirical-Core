# frozen_string_literal: true

class CreateDistrictAdminsTable < ActiveRecord::Migration[5.1]
  def change
    create_table :district_admins do |t|
      t.references :district, null: false, index: true
      t.references :user, null: false, index: true

      t.timestamps null: false
    end
  end
end
