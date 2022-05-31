# frozen_string_literal: true

class RemoveDistrictColumnsFromSchools < ActiveRecord::Migration[5.1]
  def change
    remove_column :schools, :leanm, :string
    remove_column :schools, :lea_id, :string
  end
end
