class AdminAccountsAdmins < ActiveRecord::Base
  belongs_to :admin_account
  belongs_to :admin, class_name: "User"
end
