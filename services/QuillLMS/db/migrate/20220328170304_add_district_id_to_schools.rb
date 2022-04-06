# frozen_string_literal: true

class AddDistrictIdToSchools < ActiveRecord::Migration[5.1]
  def change
    add_reference :schools, :district, index: true
  end
end
