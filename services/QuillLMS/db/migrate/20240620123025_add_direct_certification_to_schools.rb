# frozen_string_literal: true

class AddDirectCertificationToSchools < ActiveRecord::Migration[7.0]
  def change
    add_column :schools, :direct_certification, :integer
  end
end
