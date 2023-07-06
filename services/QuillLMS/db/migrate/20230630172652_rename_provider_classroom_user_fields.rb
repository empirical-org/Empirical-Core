# frozen_string_literal: true

class RenameProviderClassroomUserFields < ActiveRecord::Migration[6.1]
  def change
    rename_column :provider_classroom_users, :provider_classroom_id, :classroom_external_id
    rename_column :provider_classroom_users, :provider_user_id, :user_external_id
  end
end
