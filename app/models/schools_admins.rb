class SchoolsAdmins < ActiveRecord::Base
  belongs_to :school
  belongs_to :user

  after_create :send_admin_email

  def admin
    self.user
  end

  def send_admin_email
    if Rails.env.production? || User.find(user_id).email.match('quill.org')
      NewAdminEmailWorker.perform_async(user_id, school_id)
    end
  end

end
