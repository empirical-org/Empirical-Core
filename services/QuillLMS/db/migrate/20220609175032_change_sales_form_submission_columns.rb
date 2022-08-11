# frozen_string_literal: true

class ChangeSalesFormSubmissionColumns < ActiveRecord::Migration[5.1]
  def change
    change_column_null :sales_form_submissions, :phone_number, true
    change_column_null :sales_form_submissions, :zipcode, true
  end
end
