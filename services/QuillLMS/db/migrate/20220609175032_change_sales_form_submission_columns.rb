# frozen_string_literal: true

class ChangeSalesFormSubmissionColumns < ActiveRecord::Migration[5.1]
  def change
    change_column_null :sales_form_submissions, :phone_number, true
    change_column_null :sales_form_submissions, :zipcode, true
    change_column_null :sales_form_submissions, :school_name, true
    change_column_null :sales_form_submissions, :district_name, true
  end
end
