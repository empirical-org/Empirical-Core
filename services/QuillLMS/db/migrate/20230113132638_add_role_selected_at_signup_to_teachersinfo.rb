# frozen_string_literal: true

class AddRoleSelectedAtSignupToTeachersinfo < ActiveRecord::Migration[6.1]
  def change
    add_column :teacher_infos, :role_selected_at_signup, :string, default: ''
  end
end
