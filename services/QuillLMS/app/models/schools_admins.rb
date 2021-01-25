# == Schema Information
#
# Table name: schools_admins
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  school_id  :integer
#  user_id    :integer
#
# Indexes
#
#  index_schools_admins_on_school_id              (school_id)
#  index_schools_admins_on_school_id_and_user_id  (school_id,user_id) UNIQUE
#  index_schools_admins_on_user_id                (user_id)
#
class SchoolsAdmins < ActiveRecord::Base
  belongs_to :school
  belongs_to :user

  after_create :send_admin_email

  def admin
    user
  end

  def send_admin_email
    if Rails.env.production? || User.find(user_id).email.match('quill.org')
      NewAdminEmailWorker.perform_async(user_id, school_id)
    end
  end

end
