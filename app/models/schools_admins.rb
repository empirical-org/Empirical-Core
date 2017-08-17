class SchoolsAdmins < ActiveRecord::Base
  belongs_to :school
  belongs_to :user


  def admin
    self.user
  end

end
