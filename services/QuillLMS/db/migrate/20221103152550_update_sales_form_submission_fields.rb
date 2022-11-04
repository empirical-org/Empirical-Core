# frozen_string_literal: true

class UpdateSalesFormSubmissionFields < ActiveRecord::Migration[6.1]
  def change
    add_column :sales_form_submissions, :title, :string
    remove_column :sales_form_submissions, :school_premium_count_estimate, :integer
    remove_column :sales_form_submissions, :student_premium_count_estimate, :integer
    remove_column :sales_form_submissions, :zipcode, :string
  end
end
