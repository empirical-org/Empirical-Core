class RenameEnabledForAdminsToEnabledForStaffOnAppSettings < ActiveRecord::Migration[5.0]
  def change
    rename_column :app_settings, :enabled_for_admins, :enabled_for_staff
  end
end
