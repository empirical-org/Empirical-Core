# frozen_string_literal: true

class AddColumnsToDistricts < ActiveRecord::Migration[5.1]
  def change
    add_column :districts, :nces_id, :integer
    add_column :districts, :city, :string
    add_column :districts, :state, :string
    add_column :districts, :zipcode, :string
    add_column :districts, :phone, :string
    add_column :districts, :total_students, :integer
    add_column :districts, :total_schools, :integer
    add_column :districts, :grade_range, :string
  end
end
