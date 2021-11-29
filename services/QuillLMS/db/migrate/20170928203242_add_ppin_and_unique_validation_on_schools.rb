# frozen_string_literal: true

class AddPpinAndUniqueValidationOnSchools < ActiveRecord::Migration[4.2]
  def change
    add_column :schools, :ppin, :string
    add_index :schools, :ppin, unique: true, name: 'unique_index_schools_on_ppin', where: "ppin != ''"
  end
end
