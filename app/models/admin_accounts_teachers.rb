class AdminAccountsTeachers < ActiveRecord::Base
  belongs_to :admin_account
  belongs_to :teacher, class_name: "User"
end
