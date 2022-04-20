# frozen_string_literal: true

class CreateSalesFormSubmissions < ActiveRecord::Migration[5.1]
  def change
    create_table :sales_form_submissions do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :email, null: false
      t.string :phone_number, null: false
      t.string :zipcode, null: false
      t.string :collection_type, null: false
      t.string :school_name, null: false
      t.string :district_name, null: false
      t.integer :school_premium_count_estimate, null: false, default: 0
      t.integer :teacher_premium_count_estimate, null: false, default: 0
      t.integer :student_premium_count_estimate, null: false, default: 0
      t.string :submission_type, null: false
      t.text :comment, default: ''

      t.timestamps null: false
    end
  end
end
